'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _wolfy87Eventemitter = require('wolfy87-eventemitter');

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _cssLayout = require('css-layout');

var _cssLayout2 = _interopRequireDefault(_cssLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    this.layoutnotifier.removelistener('layout-update', cb);
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
  styleTools: _react2.default.PropTypes.object.isRequired,
  waitForLayoutCalculation: _react2.default.PropTypes.func.isRequired,
  deregister: _react2.default.PropTypes.func.isRequired
};

FlexContext.propTypes = {
  children: _react2.default.PropTypes.node
};