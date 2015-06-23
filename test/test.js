'use strict';

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
  margin: 10,
  height: 100,
  width: 100
};

@composeWith(FlexBox)
class Circle extends Component {
  render () {
    return <circle style={this.props.style} cx="40" cy="40" r="40" />;
  }
}

export default class Thing extends Component {
  static colors = (function (n) {
    const totalColors = 256**3;
    const stepSize = Math.floor(totalColors / n);
    const colorValues = []

    for (let i = 0; i < n; i++) {
      colorValues.push(i * stepSize);
    }

    return colorValues.map(value => rgb(value));
  
    function rgb (value) {
      const digits = [];

      for (let i = 0; i < 3; i++) {
        digits[i] = Math.floor(value / 256 ** (2 - i));
        value %= 256 ** (2 - i);
      }

      return `rgb(${digits[0]},${digits[1]}, ${digits[2]})`;
    }

  })(18);

  state = {
    height: 700,
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
    const { height, width } = this.state;

    const containerStyle = {
      height, 
      width,
      flexDirection: 'row',
      flexWrap: 'wrap'
    };

    return (
      <svg height={height} width={width}>
        <FlexContext>
          <rect height={height - 1} width={width - 1} style={{fill: 'lightgrey', stroke: 'black'}} />
          <Container style={containerStyle} >
            {Thing.colors.map((color, idx) => 
              <Circle style={{fill: color, ...circleStyle}} key={idx} />)}
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