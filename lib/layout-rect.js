'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  const { layout } = props;

  const passthroughProps = (0, _assign2.default)({}, props);
  delete passthroughProps.layout;

  const extraProps = (0, _assign2.default)({}, LayoutRect.defaultFormat, passthroughProps);

  return _react2.default.createElement('rect', (0, _extends3.default)({
    className: 'react-flexbox-svg-layout-rect',
    width: layout.width,
    height: layout.height
  }, extraProps));
};

LayoutRect.defaultFormat = { fill: 'transparent' };

LayoutRect.propTypes = {
  layout: _propTypes2.default.object.isRequired
};

exports.default = LayoutRect;