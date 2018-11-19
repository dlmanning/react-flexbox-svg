"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _cssLayout = _interopRequireDefault(require("css-layout"));

// FlexContext is responsible for computing layout. It's tightly coupled with
// Layoutable.
//
// The setStyle function is difficult to understand, and so is the flow of
// control between the context and the Layoutable. This file is substantially
// unchanged from the original.
const setStyle = (style = {}, styles, path = []) => {
  if (styles.style === undefined) {
    styles.style = style;
  } else {
    const childStyle = {
      style,
      children: []
    };
    styles.children.push(childStyle);
    path.push(styles.children.length - 1);
    styles = childStyle;
  }

  return {
    path: path.slice(),
    setStyle: function (childStyle) {
      return setStyle(childStyle, styles, path.slice());
    }
  };
};

class FlexContext extends _react.default.Component {
  constructor(props, context) {
    super(props);
    this.layoutNotifier = new _wolfy87Eventemitter.default();
    this.stylesRoot = {
      children: []
    };
    this.styleTools = {};
    this.deregister = this.deregister.bind(this);
    this.waitForLayoutCalculation = this.waitForLayoutCalculation.bind(this);
  }

  deregister(cb) {
    this.layoutNotifier.removeListener('layout-update', cb);
  }

  waitForLayoutCalculation(cb) {
    this.layoutNotifier.once('layout-update', cb);
  }

  getChildContext() {
    return {
      styleTools: this.styleTools,
      waitForLayoutCalculation: this.waitForLayoutCalculation,
      deregister: this.deregister
    };
  }

  render() {
    return _react.default.createElement("g", null, this.props.children);
  }

  startNewStyleTree() {
    this.stylesRoot = {
      children: []
    };
    ({
      setStyle: this.styleTools.setStyle
    } = setStyle(undefined, this.stylesRoot));
  }

  computeLayoutAndBroadcastResults() {
    (0, _cssLayout.default)(this.stylesRoot);
    this.layoutNotifier.emit('layout-update', this.stylesRoot);
  }

  componentWillMount() {
    this.startNewStyleTree();
  }

  componentDidMount() {
    this.computeLayoutAndBroadcastResults();
  }

  componentWillUpdate() {
    this.startNewStyleTree();
  }

  componentDidUpdate() {
    this.computeLayoutAndBroadcastResults();
  }

}

exports.default = FlexContext;
FlexContext.childContextTypes = {
  styleTools: _propTypes.default.object.isRequired,
  waitForLayoutCalculation: _propTypes.default.func.isRequired,
  deregister: _propTypes.default.func.isRequired
};
FlexContext.propTypes = {
  children: _propTypes.default.node
};