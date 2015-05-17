# jQuery Easter Egg [![Build Status](https://img.shields.io/travis/unindented/jquery-easteregg.svg)](http://travis-ci.org/unindented/jquery-easteregg) [![Dependency Status](https://img.shields.io/gemnasium/unindented/jquery-easteregg.svg)](https://gemnasium.com/unindented/jquery-easteregg) ![Abandoned](https://img.shields.io/badge/status-abandoned-red.svg)

Do you remember those cheats and easter eggs that you used to trigger on your NES and GameBoy games by pressing a certain sequence of buttons? Now you can add them to your pages with this tiny jQuery plugin!

## Demo

Go to <https://unindented.github.com/jquery-easteregg/> and try pressing the following sequence of keys:

<kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd>

## Usage

If you already have jQuery on your site, then it's just a matter of downloading this plugin and loading it into your page. Then just call the `easteregg` method on any element you want, providing a callback (`callback` property) and the sequence of keys that will trigger it (`sequence` property):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>jQuery Easter Egg</title>
  </head>
  <body>
    <script src="jquery.min.js"></script>
    <script src="jquery.easteregg.min.js"></script>
    <script>
      $(function () {
        $(document).easteregg({
          sequence : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
        , callback : function () {
            alert('Pizza time!');
          }
        });
      });
    </script>
  </body>
</html>
```

If no `sequence` is provided, the [Konami Code](http://en.wikipedia.org/wiki/Konami_Code) sequence will be used (<kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd>).

## Meta

* Code: `git clone git://github.com/unindented/jquery-easteregg.git`
* Home: <https://unindented.github.com/jquery-easteregg/>

## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))

## License

Copyright (c) 2012 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
