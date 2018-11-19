"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

// A utility component to assist in rendering a layout rectangle, useful for
// debugging your flex layouts.
//
// The easiest way to use it is to include renderLayoutRect, and optionally
// layoutRectProps, in the `options` passed to `Layoutable`.
//
// You can also use it directly. Use the `layoutProp` option to `Layoutable`
// to inject the layout into your component, then add it to your component:
//   <LayoutRect layout={ this.props.layout } stroke="maroon" strokeWidth="3" />
const LayoutRect = props => {
  const {
    layout
  } = props;
  const passthroughProps = Object.assign({}, props);
  delete passthroughProps.layout;
  const extraProps = Object.assign({}, LayoutRect.defaultFormat, passthroughProps);
  return _react.default.createElement("rect", (0, _extends2.default)({
    className: "react-flexbox-svg-layout-rect",
    width: layout.width,
    height: layout.height
  }, extraProps));
};

LayoutRect.defaultFormat = {
  fill: 'transparent'
};
LayoutRect.propTypes = {
  layout: _propTypes.default.object.isRequired
};
var _default = LayoutRect;
exports.default = _default;