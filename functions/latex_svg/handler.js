'use strict';

import "regenerator-runtime";
import mjAPI from "mathjax-node";
import {LatexSvgCommand} from "../lib/command/LatexCommand";

/*Start MathJax, great for container reuse*/
mjAPI.config({
  MathJax: {
    SVG: {font: "TeX"}
  }
});
mjAPI.start();

export default (event, context, callback) => {
    const latexSvgCommand = new LatexSvgCommand(event, context, callback, mjAPI);
    latexSvgCommand.execute();
};