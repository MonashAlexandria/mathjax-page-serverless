import qs from "querystring";
import encodeUrl from 'encodeurl';
import texVerifier from 'mathoid-texvcjs';
import {AlexError} from "../exception/AlexError";

export class LatexCommand {
    constructor(event, context, callback, mjAPI){
        this.event = event;
        this.context = context;
        this.callback = callback;
        this.mjAPI = mjAPI;
    }

    /**
     * Execute the lambda function
     */
    execute(){

        try{
            let data = qs.decode(this.getRequestBody(this.event));
            let response = {};

            if(typeof data === 'undefined' || typeof data.q === 'undefined' || typeof data.type === 'undefined'){
                throw new AlexError("Invalid request", 400);
            }

            const sanitizationOutput = texVerifier.check(data.q);
            if (sanitizationOutput.status !== '+') {
                response.header = {
                    'Warning': encodeUrl(sanitizationOutput.status + ' - ' + sanitizationOutput.details)
                };
            }

            this.action(data, response, (returnedData, response) => this.respond(returnedData));
        } catch (err) {
            this.respond(err);
        }

    }

    /**
     * Execute the real action
     * @param payload
     * @param response
     * @param callback
     */
    action(payload, response, callback){
        throw new AlexError("You must override this function", 500);
    }

    /**
     * Respond back to Lambda
     * @param data
     * @returns {*}
     */
    respond(data) {
        let response = data instanceof AlexError ? AlexError.buildErrorResponse(data) : data;
        if (data === null || typeof data === 'undefined') {
            delete response.body;
        }
        this.context.callbackWaitsForEmptyEventLoop = false;
        return this.callback(null, response);
    }

    /**
     * Get the request's body from event object
     * @param event
     * @returns {*|{}}
     */
    getRequestBody(event){
        return event.body;
    }
}

export class LatexSvgCommand extends LatexCommand {

    action(payload, response, callback) {
        this.mjAPI.typeset({
            math: payload.q,
            format: "TeX",
            svg: true,
            speakText: false
        }, svgData => {

            if (svgData.errors) {
                callback(new AlexError("Error:" + JSON.stringify(data.errors), 500));
            }

            if (svgData.svg) {
                svgData.svg = svgData.svg.replace(/style="([^"]+)"/, function(match, style) {
                    return 'style="'
                        + style.replace(/(?:margin(?:-[a-z]+)?|position):[^;]+; */g, '')
                        + '"';
                });
            }

            callback(Object.assign(response, {
                statusCode: 200,
                body: svgData.svg,
                'headers': {
                    "content-type": "image/svg+xml"
                }
            }));
        });
    }
}

export class LatexPngCommand extends LatexCommand {
    action(payload, response, callback) {
        this.mjAPI.typeset({
            math: payload.q,
            format: "TeX",
            png: true,
            speakText: false
        }, data => {

            console.log(data);

            if (data.errors) {
                callback(new AlexError("Error:" + JSON.stringify(data.errors), 500));
            }

            callback(Object.assign(response, {
                statusCode: 200,
                body: data.png,
                'headers': {
                    "content-type": "image/png"
                }
            }));
        });
    }
}