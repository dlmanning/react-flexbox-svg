'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layoutRect = require('./layout-rect');

var _layoutRect2 = _interopRequireDefault(_layoutRect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint react/prop-types: "off" */

const getDisplayName = Component => Component.displayName || Component.name || 'Component';

const Layoutable = (computeStyleFromProps = props => {}, options) => Composed => {
  const Wrapped = class extends _react2.default.Component {

    getMyLayout(layout) {
      this.pathToNode.forEach(childIndex => {
        layout = layout.children[childIndex];
      });

      return layout;
    }

    constructor(props, context) {
      super(props);

      this.displayName = `Layoutable(${getDisplayName(Composed)})`;

      this.computeStyleFromProps = computeStyleFromProps;
      this.options = options || {};

      this.styleTools = {};

      this.state = {
        layout: { top: 0, left: 0, width: 0, height: 0 }
      };

      this.handleLayoutCalculation = this.handleLayoutCalculation.bind(this);
    }

    handleLayoutCalculation(layout) {
      this.setState({ layout: this.getMyLayout(layout).layout });
    }

    beginLayoutCalculation(props) {
      props = props || this.props;

      const style = this.computeStyleFromProps(props);

      ({ setStyle: this.styleTools.setStyle,
        path: this.pathToNode } = this.context.styleTools.setStyle(style));

      this.context.waitForLayoutCalculation(this.handleLayoutCalculation);
    }

    componentWillMount() {
      this.beginLayoutCalculation();
    }

    componentWillReceiveProps(nextProps) {
      this.beginLayoutCalculation(nextProps);
    }

    getChildContext() {
      return {
        styleTools: this.styleTools
      };
    }

    render() {
      const transformation = `translate(${this.state.layout.left},${this.state.layout.top})`;

      const layoutRect = _react2.default.createElement(_layoutRect2.default, (0, _extends3.default)({
        layout: this.state.layout
      }, this.options.layoutRectProps));

      let layoutProp = {};
      if (this.options.layoutProp) {
        layoutProp = { [this.options.layoutProp]: this.state.layout };
      }

      return _react2.default.createElement(
        'g',
        { id: this.props.id, transform: transformation },
        this.options.renderLayoutRect ? layoutRect : null,
        _react2.default.createElement(Composed, (0, _extends3.default)({}, layoutProp, this.props))
      );
    }

  };

  Wrapped.contextTypes = {
    styleTools: _react2.default.PropTypes.object.isRequired,
    waitForLayoutCalculation: _react2.default.PropTypes.func.isRequired,
    deregister: _react2.default.PropTypes.func.isRequired
  };

  Wrapped.childContextTypes = {
    styleTools: _react2.default.PropTypes.object.isRequired
  };

  return Wrapped;
};

exports.default = Layoutable;