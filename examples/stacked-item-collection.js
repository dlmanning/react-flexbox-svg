/* eslint react/prop-types: "off" */

import React from 'react'
import {
  FlexContext,
  Layoutable as layoutable,
  FlexContainer,
} from 'react-flexbox-svg'

class _Item extends React.Component {
  render() {
    const { height } = _Item.layout

    return <rect height={height} width="100%" stroke="black" strokeWidth="3" />
  }
}
_Item.layout = { margin: 25, height: 50 }

const Item = layoutable(props => _Item.layout)(_Item)

// const Item = layoutable(props => ({ margin: 10, height: 50 }))(
//   () => <rect height="50" width="100%" stroke="black" strokeWidth="3" />)

export default class StackedItemCollection extends React.Component {
  render() {
    return (
      <svg width="800" height="600">
        <FlexContext>
          <FlexContainer style={{ flexDirection: 'column' }}>
            <Item key="1" />
            <Item key="2" />
            <Item key="3" />
          </FlexContainer>
        </FlexContext>
      </svg>
    )
  }
}
