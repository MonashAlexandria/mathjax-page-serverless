'use strict';

import "regenerator-runtime";
import mjAPI from "mathjax-node";
import qs from "querystring";
import texVerifier from 'mathoid-texvcjs';
import encodeUrl from 'encodeurl';
import {AlexError} from "../lib/exception/AlexError";

/*Start MathJax, great for container reuse*/
mjAPI.config({
  MathJax: {
    SVG: {font: "TeX"}
  }
});
mjAPI.start();

export default (event, context, callback) => {
    let response = {};
    try{
        let data = qs.decode(event.body);

        if(typeof data === 'undefined' || typeof data.q === 'undefined' || typeof data.type === 'undefined'){
            throw new AlexError("Invalid request", 400);
        }

        const sanitizationOutput = texVerifier.check(data.q);
        if (sanitizationOutput.status !== '+') {
            response.header = {
              'Warning': encodeUrl(sanitizationOutput.status + ' - ' + sanitizationOutput.details)
            };
        }

        mjAPI.typeset({
            math: data.q,
            format: "TeX",
            svg: true,
            speakText: false
        }, svgData => {

            if (data.errors) {
                return callback(null, AlexError.buildErrorResponse(new AlexError("Error:" + JSON.stringify(data.errors), 500)));
            }

            if (svgData.svg) {
                svgData.svg = svgData.svg.replace(/style="([^"]+)"/, function(match, style) {
                    return 'style="'
                        + style.replace(/(?:margin(?:-[a-z]+)?|position):[^;]+; */g, '')
                        + '"';
                });
            }

            callback(null, Object.assign(response, {
                statusCode: 200,
                body: svgData.svg
            }));
        });
    } catch(err) {
        callback(null, AlexError.buildErrorResponse(err));
    }
};