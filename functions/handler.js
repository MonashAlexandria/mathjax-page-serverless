'use strict';

// a simple TeX-input example
import mjAPI from "mathjax-node";
import qs from "querystring";
import texVerifier from 'mathoid-texvcjs';
import BbPromise from 'bluebird';

/*Start MathJax, great for container reuse*/
mjAPI.config({
  MathJax: {
    SVG: {font: "TeX"}
  }
});
mjAPI.start();
var convert = BbPromise.promisify(mjAPI.typeset);

export default BbPromise.coroutine(function* (event, context, callback) {
    let response = {};
    try{
        let data = qs.decode(event.body);
        data = yield checkInput(data);
        var sanitizationOutput = texVerifier.check(data.q);
        if (sanitizationOutput.status !== '+') {
            response.Warning = encodeUrl(sanitizationOutput.status + ' - ' + sanitizationOutput.details);
        }

        var svgData = yield convert({
            math: data.q,
            format: "TeX", // "inline-TeX", "MathML"
            svg:true,
            speakText: false
        });

        // Strip some styling returned by MathJax
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
    } catch(err) {
        callback(err);
    }
});

function checkInput(data){
  return new Promise((resolve, reject) => {
    if(typeof data === 'undefined' || typeof data.q === 'undefined' || typeof data.type === 'undefined'){
      reject();
    } else {
      resolve(data);
    }
  });
}

