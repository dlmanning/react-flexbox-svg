'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = isFlexBoxProperty;
var flexboxProperties = new _Set(['flexDirection', 'justifyContent', 'alignItems', 'alignSelf', 'position', 'flexWrap', 'flex', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth', 'left', 'top', 'right', 'bottom']);

function isFlexBoxProperty(propertyName) {
  return flexboxProperties.has(propertyName);
}

module.exports = exports['default'];