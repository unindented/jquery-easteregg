(function (phantom) {

  'use strict';

  if (phantom.args.length !== 1) {
    console.log('Usage: phantomjs run.js <runner url>');
    phantom.exit(1);
  }

  var colors = {
    'bold':      [1, 22]
  , 'italic':    [3, 23]
  , 'underline': [4, 24]
  , 'inverse':   [7, 27]
  , 'white':     [37, 39]
  , 'grey':      [90, 39]
  , 'black':     [30, 39]
  , 'blue':      [34, 39]
  , 'cyan':      [36, 39]
  , 'green':     [32, 39]
  , 'magenta':   [35, 39]
  , 'red':       [31, 39]
  , 'yellow':    [33, 39]
  };

  var styles = {
    'DEBUG':  'grey'
  , 'PASSED': 'green'
  , 'FAILED': 'red'
  };

  function stylize(str, styleType) {
    var style = styleType && styles[styleType];

    if (style) {
      return '\u001b[' + colors[style][0] + 'm' + str +
             '\u001b[' + colors[style][1] + 'm';
    } else {
      return str;
    }
  }

  function waitFor(testCondition, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000;
    var start     = new Date().getTime();
    var condition = false;
    var interval  = null;

    interval = setInterval(function () {
      var time = new Date().getTime() - start;
      if ((time < maxtimeOutMillis) && !condition) {
        // If not time-out yet and condition not yet fulfilled
        condition = testCondition();
      } else {
        if (!condition) {
          // Condition still not fulfilled (timeout but condition is `false`)
          console.log('Timeout after ' + (time / 1000) + 's');
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is `true`)
          console.log('Finished in ' + (time / 1000) + 's');
          onReady();
          clearInterval(interval);
        }
      }
    }, 100);
  }

  var page = require('webpage').create();

  // Route `console.log()` calls from within the page context to the main
  // Phantom context (i.e. current `this`).
  page.onConsoleMessage = function (str) {
    var regex   = /^(([a-z]+) - )?(.*)/i;
    var match   = regex.exec(str);
    var prefix  = match[2];
    var message = match[3];

    console.log(stylize(message, prefix));
  };

  page.onInitialized = function () {
    page.evaluate(function () {
      window.document.addEventListener('DOMContentLoaded', function () {
        var module;
        var assertions = [];

        QUnit.moduleStart(function (context) {
          module = context.name;
        });

        QUnit.testDone(function (result) {
          var name = module + ': ' + result.name;
          var i, l;

          console.log((result.failed ? 'FAILED - ' : 'PASSED - ') + name);

          for (i = 0, l = assertions.length; i < l; i += 1) {
            console.log('FAILED - - ' + assertions[i]);
          }

          assertions.length = 0;
        });

        QUnit.log(function (details) {
          var response;

          if (details.result) {
            return;
          }

          assertions.push(details.message);
        });

        QUnit.done(function (result) {
          console.log('DEBUG - Took ' + result.runtime +  'ms to run ' + result.total + ' tests.');
          console.log('DEBUG - ' + result.passed + ' passed, ' + result.failed + ' failed.');
        });
      }, false);
    });
  };

  // Open the page passed in the arguments.
  page.open(phantom.args[0], function (status) {
    if (status !== 'success') {
      console.log('Unable to access network: ' + status);
      phantom.exit(1);
    } else {
      waitFor(
        function () {
          return page.evaluate(function () {
            var el = document.body.querySelector('#qunit-testresult');
            return (el && el.innerText.match('completed') != null);
          });
        },
        function () {
          var failed = page.evaluate(function () {
            var el = document.body.querySelector('#qunit-tests .fail');
            return (el != null);
          });
          phantom.exit(failed ? 1 : 0);
        }
      );
    }
  });

}(phantom));
