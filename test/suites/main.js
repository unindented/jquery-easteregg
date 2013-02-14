(function ($, window, document, undefined) {

  'use strict';

  // ## Helpers

  // This helper triggers a sequence of `keydown` events on the specified
  // element.
  var triggerSequence = function ($elem, sequence) {
    var i, l;
    for (i = 0, l = sequence.length; i < l; i += 1) {
      $elem.trigger(jQuery.Event('keydown', { which : sequence[i] }));
    }
  };

  // ## Default sequence

  module('Plugin with default sequence', {
    setup : function () {
      var $document = $(document);

      $document.easteregg({
        callback : function () {
          ok(true, 'Callback was triggered');
        }
      });
    }
  , teardown : function () {
      var $document = $(document);

      $document.data('easteregg').teardown();
      $document.data('easteregg', null);
    }
  });

  test('gets triggered with correct sequence', 1, function () {
    triggerSequence($(document), [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]);
  });

  test('does not get triggered with incorrect sequence', 0, function () {
    triggerSequence($(document), [38, 38, 40, 40, 37, 39, 37, 39, 65, 66]);
  });

  // ## Custom sequence

  module('Plugin with custom sequence', {
    setup : function () {
      var $document = $(document);

      $document.easteregg({
        sequence : [38, 39, 40, 37]
      , callback : function () {
          ok(true, 'Callback was triggered');
        }
      });
    }
  , teardown : function () {
      var $document = $(document);

      $document.data('easteregg').teardown();
      $document.data('easteregg', null);
    }
  });

  test('gets triggered with correct sequence', 1, function () {
    triggerSequence($(document), [38, 39, 40, 37]);
  });

  test('does not get triggered with incorrect sequence', 0, function () {
    triggerSequence($(document), [37, 38, 39, 40]);
  });

}(jQuery, window, document));
