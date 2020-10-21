/* eslint-disable no-console */
const path = require('path');
const tc = require('colorette');
const getNow = () => Date.now();

const getRelative = (p) => path.relative(process.cwd(), p);

/**
 * A function to set the startTime of postcss so that
 * we can print the time taken in the output.
 */
const start = function(options) {
  return {
    postcssPlugin: 'postcss-progress-start',
    Once(root, {result}) {
      const relativeFrom = getRelative(result.opts.from);
      const relativeTo = getRelative(result.opts.to);

      console.log();
      console.log(tc.cyan(`${tc.bold(relativeFrom)} → ${tc.bold(relativeTo)}...`));
      result.startTime = getNow();
    }
  };
};

/**
 * by default there is no way to print that file was written
 * this does that.
 */
const stop = function(options) {
  return {
    postcssPlugin: 'postcss-progress-stop',
    OnceExit(root, {result}) {

      const relativeTo = getRelative(result.opts.to);
      const timeTaken = getNow() - result.startTime;

      console.log(tc.green(`created ${tc.bold(relativeTo)} in ${tc.bold(`${timeTaken}ms`)}`));
      console.log();
    }
  };
};

stop.postcss = true;
start.postcss = true;

module.exports = {
  start,
  stop
};
