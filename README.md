# stylelint-safari-background-clip

This package is just a work-a-round until https://bugs.webkit.org/show_bug.cgi?id=169125 is fixed.

It will try to detect if you use `background-clip:text` and `display:flex` or `display:inline-flex` at the same time for an element.

## ⚠️ Warning ⚠️
This library is a work in progress, use at your own risk. But feel free to help out where you see bugs or incomplete things!

## Installation

```
npm install stylelint-safari-background-clip --save-dev
```

## Configuration

### Simple configuration
```js
{
  "plugins": [
    "stylelint-safari-background-clip"
  ],
  "rules": {
    "plugin/stylelint-safari-background-clip": true
  }
}
```  

## Changelog

Please see the [CHANGELOG.md](https://github.com/jantimon/stylelint-safari-background-clip/blob/master/CHANGELOG.md)
