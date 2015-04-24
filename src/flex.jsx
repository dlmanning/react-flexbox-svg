import React from 'react';
import EventEmitter from 'wolfy87-eventemitter';
import computeLayout from 'css-layout';

const { Component } = React;

const stylesRoot = { children: [] };

function setStyle (style, styles = stylesRoot, path = []) {
  if (styles.style === undefined) {
    styles.style = style;
  } else {
    let childStyle = { style: style, children: [] };
    styles.children.push(childStyle);
    path.push(styles.children.length - 1);

    styles = childStyle;
  }

  return {
    path: path.slice(),
    setStyle : function (childStyle) {
      return setStyle(childStyle, styles, path.slice());
    }
  }
}

export class FlexContext extends Component {
  static childContextTypes = {
    setStyle: React.PropTypes.func.isRequired,
    subscribeToLayoutChanges: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super();

    this.state = {};
    this.layoutNotifier = new EventEmitter();

    const layout = props.layout || {}
    const { setStyle: layoutFunc } = setStyle(layout);
    this.setStyle = layoutFunc;
  }

  subscribeToLayoutChanges = (cb) => {
    this.layoutNotifier.on('layout-update', cb);
  }

  getChildContext () {
    return {
      setStyle: this.setStyle,
      subscribeToLayoutChanges: this.subscribeToLayoutChanges
    }
  }

  render () {
    return <g>{this.props.children}</g>;
  }

  componentDidMount () {
    const flexLayout = computeLayout(stylesRoot);
    this.setState({ layout: flexLayout });

    this.layoutNotifier.emit('layout-update', flexLayout);
  }
}

export const FlexBox = (Composed, style = {}) => class extends Component {
  static displayName = 'FlexBox';

  static contextTypes = {
    setStyle: React.PropTypes.func.isRequired,
    subscribeToLayoutChanges: React.PropTypes.func.isRequired
  }

  static childContextTypes = {
    setStyle: React.PropTypes.func.isRequired
  }

  getMyLayout (layout) {
    this.pathToNode.forEach(childIndex => {
      layout = layout.children[childIndex]
    });

    return layout;
  }

  constructor (props, context) {
    super();

    const { setStyle: setStyleFunc, path} = context.setStyle(style);

    this.setStyle = setStyleFunc;
    this.pathToNode = path;
    this.state = { layout: { top: 0, left: 0, width: 0, height: 0} };
  }

  componentDidMount () {
    this.context.subscribeToLayoutChanges(layout => {
      this.setState({ layout: this.getMyLayout(layout) });
    });
  }

  getChildContext () {
    return {
      setStyle: this.setStyle
    }
  }

  render () {
    const transformation = `translate(${this.state.layout.left},${this.state.layout.top})`
    return <g transform={transformation}><Composed layout={this.state.layout} {...this.props}/></g>;
  }

}
