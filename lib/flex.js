'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
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

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

function _setStyle(style, styles) {
  if (style === undefined) style = {};
  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

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
  _inherits(FlexContext, _Component);

  _createClass(FlexContext, null, [{
    key: 'childContextTypes',
    value: {
      styleTools: _react2['default'].PropTypes.object.isRequired,
      waitForLayoutCalculation: _react2['default'].PropTypes.func.isRequired,
      deregister: _react2['default'].PropTypes.func.isRequired
    },
    enumerable: true
  }]);

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

      this.styleTools.setStyle = _setStyle2.setStyle;
    }
  }, {
    key: 'computeLayoutAndBroadcastResults',
    value: function computeLayoutAndBroadcastResults() {
      (0, _cssLayout2['default'])(this.stylesRoot);
      this.layoutNotifier.emit('layout-update', this.stylesRoot);
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
  }]);

  return FlexContext;
})(Component);

exports.FlexContext = FlexContext;
var FlexBox = function FlexBox(Composed) {
  var componentStyles = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return (function (_Component2) {
    _inherits(_class, _Component2);

    _createClass(_class, [{
      key: 'getMyLayout',
      value: function getMyLayout(layout) {
        this.pathToNode.forEach(function (childIndex) {
          layout = layout.children[childIndex];
        });

        return layout;
      }
    }], [{
      key: 'displayName',
      value: 'FlexBox(' + getDisplayName(Composed) + ')',
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

    function _class(props, context) {
      var _this2 = this;

      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);

      this.handleLayoutCalculation = function (layout) {
        _this2.setState({ layout: _this2.getMyLayout(layout).layout });
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
    }

    _createClass(_class, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _context$styleTools$setStyle = this.context.styleTools.setStyle(this.flexStyles);

        this.styleTools.setStyle = _context$styleTools$setStyle.setStyle;
        this.pathToNode = _context$styleTools$setStyle.path;

        this.context.waitForLayoutCalculation(this.handleLayoutCalculation);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _partitionStyles2 = partitionStyles(nextProps.style);

        var flexStyles = _partitionStyles2.flexStyles;

        var _context$styleTools$setStyle2 = this.context.styleTools.setStyle(flexStyles);

        this.styleTools.setStyle = _context$styleTools$setStyle2.setStyle;
        this.pathToNode = _context$styleTools$setStyle2.path;

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
        var _props = this.props;
        var style = _props.style;

        var other = _objectWithoutProperties(_props, ['style']);

        return _react2['default'].createElement(
          'g',
          { transform: transformation },
          _react2['default'].createElement(Composed, _extends({ layout: this.state.layout, style: this.state.styles }, other))
        );
      }
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