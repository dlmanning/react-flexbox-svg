'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _wolfy87Eventemitter = require('wolfy87-eventemitter');

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _cssLayout = require('css-layout');

var _cssLayout2 = _interopRequireDefault(_cssLayout);

var _flexboxProps = require('./flexbox-props');

var _flexboxProps2 = _interopRequireDefault(_flexboxProps);

var Component = _react2['default'].Component;

function _setStyle(style, styles) {
  if (style === undefined) style = {};
  var path = arguments[2] === undefined ? [] : arguments[2];

  if (styles.style === undefined) {
    styles.style = style;
  } else {
    var childStyle = { style: style, children: [] };
    styles.children.push(childStyle);
    path.push(styles.children.length - 1);

    styles = childStyle;
  }

  return {
    path: path.slice(),
    setStyle: function setStyle(childStyle) {
      return _setStyle(childStyle, styles, path.slice());
    }
  };
}

var FlexContext = (function (_Component) {
  function FlexContext(props, context) {
    var _this = this;

    _classCallCheck(this, FlexContext);

    _get(Object.getPrototypeOf(FlexContext.prototype), 'constructor', this).call(this, props);

    this.deregister = function (cb) {
      _this.layoutNotifier.removeListener('layout-update', cb);
    };

    this.waitForLayoutCalculation = function (cb) {
      _this.layoutNotifier.once('layout-update', cb);
    };

    this.layoutNotifier = new _wolfy87Eventemitter2['default']();

    this.stylesRoot = { children: [] };
    this.styleTools = {};
  }

  _inherits(FlexContext, _Component);

  _createClass(FlexContext, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        styleTools: this.styleTools,
        waitForLayoutCalculation: this.waitForLayoutCalculation,
        deregister: this.deregister
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'g',
        null,
        this.props.children
      );
    }
  }, {
    key: 'startNewStyleTree',
    value: function startNewStyleTree() {
      this.stylesRoot = { children: [] };

      var _setStyle2 = _setStyle(undefined, this.stylesRoot);

      var layoutFunc = _setStyle2.setStyle;

      this.styleTools.setStyle = layoutFunc;
    }
  }, {
    key: 'computeLayoutAndBroadcastResults',
    value: function computeLayoutAndBroadcastResults() {
      var flexLayout = (0, _cssLayout2['default'])(this.stylesRoot);
      this.layoutNotifier.emit('layout-update', flexLayout);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.startNewStyleTree();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.computeLayoutAndBroadcastResults();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this.startNewStyleTree();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.computeLayoutAndBroadcastResults();
    }
  }], [{
    key: 'childContextTypes',
    value: {
      styleTools: _react2['default'].PropTypes.object.isRequired,
      waitForLayoutCalculation: _react2['default'].PropTypes.func.isRequired,
      deregister: _react2['default'].PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  return FlexContext;
})(Component);

exports.FlexContext = FlexContext;
var FlexBox = function FlexBox(Composed) {
  var componentStyles = arguments[1] === undefined ? {} : arguments[1];
  return (function (_Component2) {
    var _class = function (props, context) {
      var _this2 = this;

      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);

      this.handleLayoutCalculation = function (layout) {
        _this2.setState({ layout: _this2.getMyLayout(layout) });
      };

      var style = _Object$assign(componentStyles, props.style);

      var _partitionStyles = partitionStyles(style);

      var svgStyles = _partitionStyles.svgStyles;
      var flexStyles = _partitionStyles.flexStyles;

      this.flexStyles = flexStyles;
      this.styleTools = {};

      this.state = {
        layout: { top: 0, left: 0, width: 0, height: 0 },
        styles: svgStyles
      };
    };

    _inherits(_class, _Component2);

    _createClass(_class, [{
      key: 'getMyLayout',
      value: function getMyLayout(layout) {
        this.pathToNode.forEach(function (childIndex) {
          layout = layout.children[childIndex];
        });

        return layout;
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _context$styleTools$setStyle = this.context.styleTools.setStyle(this.flexStyles);

        var setStyleFunc = _context$styleTools$setStyle.setStyle;
        var path = _context$styleTools$setStyle.path;

        this.styleTools.setStyle = setStyleFunc;
        this.pathToNode = path;

        this.context.waitForLayoutCalculation(this.handleLayoutCalculation);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.deregister(this.handleLayoutCalculation);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        var _context$styleTools$setStyle2 = this.context.styleTools.setStyle(this.flexStyles);

        var setStyleFunc = _context$styleTools$setStyle2.setStyle;
        var path = _context$styleTools$setStyle2.path;

        this.styleTools.setStyle = setStyleFunc;
        this.pathToNode = path;

        this.context.waitForLayoutCalculation(this.handleLayoutCalculation);
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          styleTools: this.styleTools
        };
      }
    }, {
      key: 'render',
      value: function render() {
        var transformation = 'translate(' + this.state.layout.left + ',' + this.state.layout.top + ')';
        return _react2['default'].createElement(
          'g',
          { transform: transformation },
          _react2['default'].createElement(Composed, _extends({ layout: this.state.layout, style: this.state.styles }, this.props))
        );
      }
    }], [{
      key: 'displayName',
      value: 'FlexBox',
      enumerable: true
    }, {
      key: 'contextTypes',
      value: {
        styleTools: _react2['default'].PropTypes.object.isRequired,
        waitForLayoutCalculation: _react2['default'].PropTypes.func.isRequired,
        deregister: _react2['default'].PropTypes.func.isRequired
      },
      enumerable: true
    }, {
      key: 'childContextTypes',
      value: {
        styleTools: _react2['default'].PropTypes.object.isRequired
      },
      enumerable: true
    }]);

    return _class;
  })(Component);
};

exports.FlexBox = FlexBox;
function partitionStyles(styles) {
  return _Object$keys(styles).reduce(function (partitions, property) {
    if ((0, _flexboxProps2['default'])(property)) {
      partitions.flexStyles[property] = styles[property];
    } else {
      partitions.svgStyles[property] = styles[property];
    }

    return partitions;
  }, { svgStyles: {}, flexStyles: {} });
}