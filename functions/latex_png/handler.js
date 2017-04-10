'use strict';

import "regenerator-runtime";
import mjAPI from "mathjax-node-svg2png";
import {LatexPngCommand} from "../lib/command/LatexCommand";

/*Start MathJax, great for container reuse*/
mjAPI.config({
  MathJax: {
    SVG: {font: "TeX"}
  }
});
mjAPI.start();

export default (event, context, callback) => {
    const latexPngCommand = new LatexPngCommand(event, context, callback, mjAPI);
    latexPngCommand.execute();
};