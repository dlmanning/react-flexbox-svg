'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _EventEmitter = require('wolfy87-eventemitter');

var _EventEmitter2 = _interopRequireWildcard(_EventEmitter);

var _computeLayout = require('css-layout');

var _computeLayout2 = _interopRequireWildcard(_computeLayout);

var _isFlexBoxProperty = require('./flexbox-props');

var _isFlexBoxProperty2 = _interopRequireWildcard(_isFlexBoxProperty);

var Component = _React2['default'].Component;

var stylesRoot = { children: [] };

function setStyle(style) {
  var styles = arguments[1] === undefined ? stylesRoot : arguments[1];
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
    setStyle: (function (_setStyle) {
      function setStyle(_x) {
        return _setStyle.apply(this, arguments);
      }

      setStyle.toString = function () {
        return _setStyle.toString();
      };

      return setStyle;
    })(function (childStyle) {
      return setStyle(childStyle, styles, path.slice());
    })
  };
}

var FlexContext = (function (_Component) {
  function FlexContext(props, context) {
    var _this = this;

    _classCallCheck(this, FlexContext);

    _get(Object.getPrototypeOf(FlexContext.prototype), 'constructor', this).call(this);

    this.subscribeToLayoutChanges = function (cb) {
      _this.layoutNotifier.on('layout-update', cb);
    };

    this.state = {};
    this.layoutNotifier = new _EventEmitter2['default']();

    var layout = props.layout || {};

    var _setStyle2 = setStyle(layout);

    var layoutFunc = _setStyle2.setStyle;

    this.setStyle = layoutFunc;
  }

  _inherits(FlexContext, _Component);

  _createClass(FlexContext, [{
    key: 'subscribeToLayoutChanges',
    value: undefined,
    enumerable: true
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        setStyle: this.setStyle,
        subscribeToLayoutChanges: this.subscribeToLayoutChanges
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _React2['default'].createElement(
        'g',
        null,
        this.props.children
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var flexLayout = _computeLayout2['default'](stylesRoot);
      this.setState({ layout: flexLayout });

      this.layoutNotifier.emit('layout-update', flexLayout);
    }
  }], [{
    key: 'childContextTypes',
    value: {
      setStyle: _React2['default'].PropTypes.func.isRequired,
      subscribeToLayoutChanges: _React2['default'].PropTypes.func.isRequired
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
      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this);

      var styles = _Object$assign(componentStyles, props.styles);

      var _Object$keys$reduce = _Object$keys(styles).reduce(function (partitions, property) {
        if (_isFlexBoxProperty2['default'](property)) {
          partitions.flexStyles[property] = styles[property];
        } else {
          partitions.svgStyles[property] = styles[property];
        }

        return partitions;
      }, { svgStyles: {}, flexStyles: {} });

      var svgStyles = _Object$keys$reduce.svgStyles;
      var flexStyles = _Object$keys$reduce.flexStyles;

      var _context$setStyle = context.setStyle(flexStyles);

      var setStyleFunc = _context$setStyle.setStyle;
      var path = _context$setStyle.path;

      this.setStyle = setStyleFunc;
      this.pathToNode = path;

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
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.context.subscribeToLayoutChanges(function (layout) {
          _this2.setState({ layout: _this2.getMyLayout(layout) });
        });
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          setStyle: this.setStyle
        };
      }
    }, {
      key: 'render',
      value: function render() {
        var transformation = 'translate(' + this.state.layout.left + ',' + this.state.layout.top + ')';
        return _React2['default'].createElement(
          'g',
          { transform: transformation },
          _React2['default'].createElement(Composed, _extends({ layout: this.state.layout, style: this.state.styles }, this.props))
        );
      }
    }], [{
      key: 'displayName',
      value: 'FlexBox',
      enumerable: true
    }, {
      key: 'contextTypes',
      value: {
        setStyle: _React2['default'].PropTypes.func.isRequired,
        subscribeToLayoutChanges: _React2['default'].PropTypes.func.isRequired
      },
      enumerable: true
    }, {
      key: 'childContextTypes',
      value: {
        setStyle: _React2['default'].PropTypes.func.isRequired
      },
      enumerable: true
    }]);

    return _class;
  })(Component);
};
exports.FlexBox = FlexBox;