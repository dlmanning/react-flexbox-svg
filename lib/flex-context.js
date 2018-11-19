'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _wolfy87Eventemitter = require('wolfy87-eventemitter');

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _cssLayout = require('css-layout');

var _cssLayout2 = _interopRequireDefault(_cssLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const childStyle = { style: style, children: [] };
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

let FlexContext = class FlexContext extends _react2.default.Component {

  constructor(props, context) {
    super(props);

    this.layoutNotifier = new _wolfy87Eventemitter2.default();

    this.stylesRoot = { children: [] };
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
    return _react2.default.createElement(
      'g',
      null,
      this.props.children
    );
  }

  startNewStyleTree() {
    this.stylesRoot = { children: [] };
    ({ setStyle: this.styleTools.setStyle } = setStyle(undefined, this.stylesRoot));
  }

  computeLayoutAndBroadcastResults() {
    (0, _cssLayout2.default)(this.stylesRoot);
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

};
exports.default = FlexContext;


FlexContext.childContextTypes = {
  styleTools: _propTypes2.default.object.isRequired,
  waitForLayoutCalculation: _propTypes2.default.func.isRequired,
  deregister: _propTypes2.default.func.isRequired
};

FlexContext.propTypes = {
  children: _propTypes2.default.node
};