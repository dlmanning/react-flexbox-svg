"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ = require(".");

// FlexContainer is a convenience class. It's not required that you use it,
// though it saves you from creating a React class for your container.
const FlexContainer = props => {
  const layoutRect = _react.default.createElement(_.LayoutRect, (0, _extends2.default)({
    layout: props.layout
  }, props.layoutRectProps));

  return _react.default.createElement("g", {
    id: props.id
  }, props.renderLayoutRect ? layoutRect : null, props.children);
};

FlexContainer.propTypes = {
  layout: _propTypes.default.object.isRequired,
  // Passed via Layoutable.
  id: _propTypes.default.string,
  layoutRectProps: _propTypes.default.object,
  renderLayoutRect: _propTypes.default.bool,
  children: _propTypes.default.node
};
FlexContainer.defaultProps = {
  renderLayoutRect: false
};

const computeStyleFromProps = props => props.style;

var _default = (0, _.Layoutable)(computeStyleFromProps, {
  layoutProp: 'layout'
})(FlexContainer);

exports.default = _default;