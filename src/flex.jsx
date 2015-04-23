import React from 'react';
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
    getLayout: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super();

    this.state = {};

    const layout = props.layout || {}
    const { setLayout: layoutFunc } = setLayout(layout);
    this.setLayout = layoutFunc;
  }

  getLayout = (path = []) => {
    if (this.state.flexStyles !== undefined && path.length > 0) {
      let layout = this.state.flexStyles;
      path.forEach(childIndex => {
        layout = layout.children[childIndex]
      });

      return layout;
    } else {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      };
    }
  }

  getChildContext () {
    return {
      setLayout: this.setLayout,
      getLayout: this.getLayout
    }
  }

  render () {
    console.log('Rendering FlexContext');
    return <g>{this.props.children}</g>;
  }

  componentDidMount () {
    console.log('FlexContainer did mount');
    const flexStyles = computeLayout(styles);
    this.setState({ flexStyles: flexStyles });
  }
}

export const FlexBox = (Composed, style = {}) => class extends Component {
  static displayName = 'FlexBox';

  static contextTypes = {
    setLayout: React.PropTypes.func.isRequired,
    getLayout: React.PropTypes.func.isRequired
  }

  static childContextTypes = {
    setLayout: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super();

    const { setLayout: layoutFunc, path} = context.setLayout(style);

    this.setLayout = layoutFunc;
    this.pathToNode = path;
  }

  getChildContext () {
    return {
      setLayout: this.setLayout
    }
  }

  render () {
    const layout = this.context.getLayout(this.pathToNode);
    const transformation = `translate(${layout.left},${layout.top})`
    return <g transform={transformation}><Composed {...this.props} layout={layout}/></g>;
  }

}