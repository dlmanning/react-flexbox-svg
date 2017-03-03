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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  layout: _react2.default.PropTypes.object.isRequired
};

exports.default = LayoutRect;