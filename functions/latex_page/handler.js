'use strict';

import mjNodePage from "mathjax-node-page";

/*Start MathJax, great for container reuse*/
const mjnodeConfig = {
    svg: true,
    linebreaks: true,
    equationNumbers: "all"
};

const pageConfig = {
    format: ["TeX"],
    MathJax: {
        config: "TeX-AMS_HTML"
    }
};

export default (event, context, callback) => {
    mjNodePage.mjpage(event.body, pageConfig, mjnodeConfig, function(output) {
        console.log(output); // resulting HTML string
        callback(null, {
            statusCode: 200,
            body: output
        });
    });
};