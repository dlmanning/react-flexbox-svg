/* eslint react/prop-types: "off" */

import React from 'react'
import {
  FlexContext,
  Layoutable as layoutable,
  FlexContainer,
} from 'react-flexbox-svg'
import generateColors from './colors'
import setTweenInterval from './tween'

class Circle extends React.Component {
  render() {
    return <circle style={{ fill: this.props.color }} cx="40" cy="40" r="40" />
  }
}
Circle.layout = { margin: 10, height: 100, width: 100 }

const LayoutableCircle = layoutable(props => Circle.layout)(Circle)

export default class DynamicCollection extends React.Component {
  constructor(props) {
    super(props)

    this.colors = generateColors(18)

    this.state = { height: 700, width: 700 }
  }

  componentDidMount() {
    this.tweenInterval = setTweenInterval(
      width => {
        this.setState({ width })
      },
      25,
      { min: 150, max: 700 }
    )
  }

  componentWillUnmount() {
    clearInterval(this.tweenInterval)
  }

  render() {
    const { height, width } = this.state

    const containerStyle = {
      height,
      width,
      flexDirection: 'row',
      flexWrap: 'wrap',
    }

    const formatColor = rgb => `rgb(${rgb.join(', ')})`

    return (
      <svg height={height} width={width}>
        <FlexContext>
          <rect
            height={height - 1}
            width={width - 1}
            style={{ fill: 'lightgrey', stroke: 'black' }}
          />

          <FlexContainer style={containerStyle}>
            {this.colors.map((color, index) => (
              <LayoutableCircle key={index} color={formatColor(color)} />
            ))}
          </FlexContainer>
        </FlexContext>
      </svg>
    )
  }
}
