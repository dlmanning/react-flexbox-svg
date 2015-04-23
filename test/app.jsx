import React from 'react';
import { FlexContext, FlexBox } from 'flex';

const { Component } = React;

class Container extends Component {
  render () {
    console.log('Rendering Container');
    return (
      <g>
        <rect fill={this.props.color} 
          x="0"
          y="0"
          width={this.props.layout.width}
          height={this.props.layout.height} />
        {this.props.children}
      </g>
    );
  }
}

const Backdrop = FlexBox(Container, {
  flexDirection: 'row',
  flex: 1,
  padding: 40,
  justifyContent: 'flex-start'
});

const Square = FlexBox(Container, {
  height: 40,
  width: 40
});

const containerStyle = {
  width: 400,
  height: 400
}

export default class App extends Component {
  render () {
    const board = [];

    for (let i = 0; i < 64; i++) {
      board[i] = i;
    }


    return (
      <svg height="600" width="600">
        <FlexContext layout={containerStyle}>
          <Backdrop color="#CE6E09">
            {board.map(id => <Square key={id} color={id % 2 ? '#470300' : '#F6B968'} />)}
          </Backdrop>
        </FlexContext>
      </svg>
    )
  }
}