"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layoutRect = _interopRequireDefault(require("./layout-rect"));

/* eslint react/prop-types: "off" */
// Higher-order component for a flex item or container. Returns a function
// which returns a function which wraps a component, so you need to invoke it
// twice. First with a `computeStyleFromProps` function and `options`, and
// then with the component you wish to wrap. (This is for compatibility with
// ES7 decorators.)
//
// You must enclose the tree containing your Layoutable components in a
// FlexContext component.
//
// Layoutable(computeStyleFromProps, options)(Component)
//
// computeStyleFromProps: (Optional) A function which receives props and uses
//   those to compute the flex layout parameters, such as width, height,
//   margin, and flexDirection. This runs before the component renders, so you
//   won't have access to the component instance, only the props.
//
// options: (Optional) An object:
//   - layoutProp: (Optional) When set, the computed layout will be passed to
//     the wrapped component, with a prop of this name. Use this to get
//     access to the layout inside the wrapped component. See LayoutRect for an
//     example of how this works.
//   - renderLayoutRect: (Optional) If true, a rectangle is rendered occupying
//     the computed layout area. The rect is added to the DOM but by default is
//     not visible. For a visible layout rect, also set layoutRectProps.
//   - layoutRectProps: (Optional) Additional properties passed to the layout
//     rectangle. e.g. { stroke: 'maroon', strokeWidth: 3, fill: 'red' }
//
// Component: The React component to wrap.
//
// This used to be called FlexBox. The coupling between Layoutable and FlexBox
// is largely unchanged from the original.
const getDisplayName = Component => Component.displayName || Component.name || 'Component';

const Layoutable = (computeStyleFromProps = props => {}, options) => Composed => {
  const Wrapped = class extends _react.default.Component {
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
        layout: {
          top: 0,
          left: 0,
          width: 0,
          height: 0
        }
      };
      this.handleLayoutCalculation = this.handleLayoutCalculation.bind(this);
    }

    handleLayoutCalculation(layout) {
      this.setState({
        layout: this.getMyLayout(layout).layout
      });
    }

    beginLayoutCalculation(props) {
      props = props || this.props;
      const style = this.computeStyleFromProps(props);
      ({
        setStyle: this.styleTools.setStyle,
        path: this.pathToNode
      } = this.context.styleTools.setStyle(style));
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

      const layoutRect = _react.default.createElement(_layoutRect.default, (0, _extends2.default)({
        layout: this.state.layout
      }, this.options.layoutRectProps));

      let layoutProp = {};

      if (this.options.layoutProp) {
        layoutProp = {
          [this.options.layoutProp]: this.state.layout
        };
      }

      return _react.default.createElement("g", {
        id: this.props.id,
        transform: transformation
      }, this.options.renderLayoutRect ? layoutRect : null, _react.default.createElement(Composed, (0, _extends2.default)({}, layoutProp, this.props)));
    }

  };
  Wrapped.contextTypes = {
    styleTools: _propTypes.default.object.isRequired,
    waitForLayoutCalculation: _propTypes.default.func.isRequired,
    deregister: _propTypes.default.func.isRequired
  };
  Wrapped.childContextTypes = {
    styleTools: _propTypes.default.object.isRequired
  };
  return Wrapped;
};

var _default = Layoutable;
exports.default = _default;