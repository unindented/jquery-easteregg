/*!
 * jQuery Easter Egg
 * http://unindented.github.com/jquery-easteregg/
 *
 * Copyright 2012, Daniel Perez Alvarez
 * Licensed under the Apache License, Version 2.0
 */

(function ($, undefined) {

  'use strict';

  // # jQuery Easter Egg

  // Allows you to trigger a callback when the user presses a certain sequence
  // of keys.

  var plugin = {

    // ## Default options

    options : {
      sequence : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65] // Konami Code
    }

    // ## Setup

  , setup : function (elem, options) {
      $.extend(this.options, options);

      this.index = 0;
      this.elem  = elem;

      $(this.elem).on('keydown.easteregg', $.proxy(this.onKeyDown, this));

      return this;
    }

    // ## Teardown

  , teardown : function () {
      $(this.elem).off('.easteregg');

      return this;
    }

    // ## Key listener

  , onKeyDown : function (evt) {
      var options  = this.options;
      var sequence = options.sequence;
      var callback = options.callback;

      if (evt.which === sequence[this.index]) {
        // If the user presses the right key, advance the index...
        this.index += 1;
        if (this.index === sequence.length) {
          // ... until we reach the end of the sequence.
          this.index = 0;
          if (callback != null) {
            callback.call(this.elem);
          }
        }
      } else {
        // If the user presses the wrong key, reset the index.
        this.index = 0;
      }
    }

  };

  // ## Object.create polyfill

  // Covers the main use case, which is creating a new object for which the
  // prototype has been chosen, but doesn't take the second argument into
  // account.
  if (typeof Object.create !== 'function') {
    Object.create = function (object) {
      var F = function () {};
      F.prototype = object;
      return new F();
    };
  }

  // ## Pluginize

  // Creates a jQuery plugin based on a defined object.
  $.pluginize = function (name, object) {
    $.fn[name] = function (options) {
      return this.each(function () {
        var plugin;
        if (!$(this).data(name)) {
          plugin = Object.create(object).setup(this, options);
          $(this).data(name, plugin);
        }
      });
    };
    return object;
  };

  $.pluginize('easteregg', plugin);

}(jQuery));
