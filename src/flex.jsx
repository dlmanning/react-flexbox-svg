import React from 'react';
import EventEmitter from 'wolfy87-eventemitter';
import computeLayout from 'css-layout';

const { Component } = React;

const styles = { children: [] };

function setLayout (style, layout = styles, path = []) {
  if (layout.style === undefined) {
    layout.style = style;
  } else {
    let childLayout = { style: style, children: [] };
    layout.children.push(childLayout);
    path.push(layout.children.length - 1);

    layout = childLayout;
  }

  return {
    path: path.slice(),
    setLayout : function (style) {
      return setLayout(style, layout, path.slice());
    }
  }
}

export class FlexContext extends Component {
  static childContextTypes = {
    setLayout: React.PropTypes.func.isRequired,
    subscribeToLayoutChanges: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super();

    this.state = {};
    this.layoutNotifier = new EventEmitter();

    const layout = props.layout || {}
    const { setLayout: layoutFunc } = setLayout(layout);
    this.setLayout = layoutFunc;
  }

  subscribeToLayoutChanges = (cb) => {
    this.layoutNotifier.on('layout-update', cb);
  }

  getChildContext () {
    return {
      setLayout: this.setLayout,
      subscribeToLayoutChanges: this.subscribeToLayoutChanges
    }
  }

  render () {
    return <g>{this.props.children}</g>;
  }

  componentDidMount () {
    const flexStyles = computeLayout(styles);
    this.setState({ flexStyles: flexStyles });

    this.layoutNotifier.emit('layout-update', flexStyles);
  }
}

export const FlexBox = (Composed, style = {}) => class extends Component {
  static displayName = 'FlexBox';

  static contextTypes = {
    setLayout: React.PropTypes.func.isRequired,
    subscribeToLayoutChanges: React.PropTypes.func.isRequired
  }

  static childContextTypes = {
    setLayout: React.PropTypes.func.isRequired
  }

  getMyLayout (layout) {
    this.pathToNode.forEach(childIndex => {
      layout = layout.children[childIndex]
    });

    return layout;
  }

  constructor (props, context) {
    super();

    const { setLayout: layoutFunc, path} = context.setLayout(style);

    this.setLayout = layoutFunc;
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
      setLayout: this.setLayout
    }
  }

  render () {
    const transformation = `translate(${this.state.layout.left},${this.state.layout.top})`
    return <g transform={transformation}><Composed {...this.props} layout={this.state.layout}/></g>;
  }

}
