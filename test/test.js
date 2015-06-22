import { default as React, Component } from 'react';
import { FlexContext, FlexBox } from 'flex';
import { EventEmitter } from 'wolfy87-eventemitter';

@composeWith(FlexBox)
class Container extends Component {
  render () {
    return <g>{this.props.children}</g>
  }
}

const circleStyle = {
  height: 150,
  width: 150,
  fill: 'tomato'
};

@composeWith(FlexBox)
class Circle extends Component {
  render () {
    return <circle style={this.props.style} cx="50" cy="50" r="50" />;
  }
}

export default class Thing extends Component {
  state = {
    height: 900,
    width: 700
  };

  componentDidMount () {
    let t = 0;

    setInterval(() => {
      const width = 275 * Math.cos(++t / (8 * Math.PI)) + 425;
      this.setState({ width });
    }, 25);
  }

  render () {
    console.log('Calling render');

    const containerStyle = {
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: this.state.height,
      width: this.state.width
    };

    return (
      <svg height={this.state.height} width={this.state.width}>
        <FlexContext>
          <rect height={this.state.height - 1} width={this.state.width - 1} style={{fill: 'none', stroke: 'black'}} />
          <Container style={containerStyle} >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(idx =>
              <Circle style={circleStyle} key={idx} />)}
          </Container>
        </FlexContext>
      </svg>
    );
  }
}

function composeWith (...hocs) {
  return target =>
    hocs.reduce((composite, hoc) =>
      hoc(composite),
    target);
}