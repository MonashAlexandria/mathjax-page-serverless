'use strict';

import mjNodePage from "mathjax-node-page";

/*Start MathJax, great for container reuse*/
const mjnodeConfig = {
    svg: true,
    linebreaks: true
};

const pageConfig = {
    format: ["TeX"]
};

export default (event, context, callback) => {
    try{
        mjNodePage.mjpage(event.body, pageConfig, mjnodeConfig, function(output) {
            callback(null, {
                statusCode: 200,
                body: output
            });
        });
    } catch(ex){
        console.error(ex);
        callback(null, {
            statusCode: 500,
            body: "Failed to transform latex to svg"
        });
    }

};