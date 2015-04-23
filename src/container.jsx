import React from 'react';
import computeLayout from 'css-layout';

const { Component } = React;

const layout = {
  children: []
};

let flexLayout;

function setFlexContainerStyle (style) {
  layout.layout = {width: undefined, height: undefined, top: 0, left: 0};
  layout.style = style;
}

function setFlexItemStyle (style) {
  layout.children.push({
    layout: { width: undefined, height: undefined, top: 0, left: 0 },
     style: style
   });
}

function getFlexItemStyle () {
  if (flexLayout && flexLayout.children) {
    return flexLayout.children.shift();
  } else {
    return undefined;
  }
}

export const FlexContainer = (Composed, style = {}) => class extends Component {
  static displayName = "FlexContainer";

  static childContextTypes = {
    setFlexStyle: React.PropTypes.func.isRequired,
    getFlexStyle: React.PropTypes.func.isRequired
  };

  constructor () {
    super();
    console.log('Constructor called');
    this.state = {};

    setFlexContainerStyle(style);
  }

  componentDidMount () {
    flexLayout = computeLayout(layout);
    this.setState({flexLayout: flexLayout});
  }

  getChildContext () {
    console.log('getChildContext called');
    return { 
      setFlexStyle: setFlexItemStyle,
      getFlexStyle: getFlexItemStyle,
    };
  }

  getFlexStyle = () => this.state.flexLayout;

  render () {
    return <Composed {...this.props} setFlexStyle={setFlexContainerStyle} getFlexStyle={this.getFlexStyle}/>;
  }
}

export const FlexItem = (Composed, style = {}) => class extends Component {
  static displayName = "FlexItem";

  static contextTypes = {
    setFlexStyle: React.PropTypes.func.isRequired,
    getFlexStyle: React.PropTypes.func.isRequired
  };

  constructor (props, context) {
    super();

    context.setFlexStyle(style);
  }

  render () {
    //const context = this._reactInternalInstance._context;
    return <Composed {...this.props} setFlexStyle={this.context.setFlexStyle} getFlexStyle={this.context.getFlexStyle}/>;
  }
}