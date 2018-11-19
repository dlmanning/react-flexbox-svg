'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ = require('.');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FlexContainer is a convenience class. It's not required that you use it,
// though it saves you from creating a React class for your container.

const FlexContainer = props => {
  const layoutRect = _react2.default.createElement(_.LayoutRect, (0, _extends3.default)({ layout: props.layout }, props.layoutRectProps));

  return _react2.default.createElement(
    'g',
    { id: props.id },
    props.renderLayoutRect ? layoutRect : null,
    props.children
  );
};

FlexContainer.propTypes = {
  layout: _react2.default.PropTypes.object.isRequired, // Passed via Layoutable.
  id: _react2.default.PropTypes.string,
  layoutRectProps: _react2.default.PropTypes.object,
  renderLayoutRect: _react2.default.PropTypes.bool,
  children: _react2.default.PropTypes.node
};

FlexContainer.defaultProps = {
  renderLayoutRect: false
};

const computeStyleFromProps = props => props.style;

exports.default = (0, _.Layoutable)(computeStyleFromProps, { layoutProp: 'layout' })(FlexContainer);