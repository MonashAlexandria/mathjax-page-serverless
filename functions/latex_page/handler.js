'use strict';

let mjNodePage = require("mathjax-node-page");

/*Start MathJax, great for container reuse*/
const mjnodeConfig = {
    svg: true,
    linebreaks: true
};

const pageConfig = {
    format: ["TeX"]
};

exports.default = function(event, context, callback) {
    try{
        mjNodePage.mjpage(event.body, pageConfig, mjnodeConfig, function(output) {
            callback(null, {
                statusCode: 200,
                body: output,
                headers: {
                    'content-type': 'text/html'
                }
            });
        });
    } catch(ex){
        console.error(ex);
        callback(null, {
            statusCode: 500,
            body: "Failed to transform latex to svg",
            headers: {
                'content-type': 'text/html'
            }
        });
    }

};