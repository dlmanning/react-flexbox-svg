import React from 'react'
import { Layoutable as layoutable, LayoutRect } from '.'

// FlexContainer is a convenience class. It's not required that you use it,
// though it saves you from creating a React class for your container.

const FlexContainer = props => {
  const layoutRect = <LayoutRect layout={ props.layout } { ...props.layoutRectProps } />

  return (
    <g id={ props.id }>
      { props.renderLayoutRect ? layoutRect : null }
      { props.children }
    </g>
  )
}

FlexContainer.propTypes = {
  layout: React.PropTypes.object.isRequired, // Passed via Layoutable.
  id: React.PropTypes.string,
  layoutRectProps: React.PropTypes.object,
  renderLayoutRect: React.PropTypes.bool,
  children: React.PropTypes.node,
}

FlexContainer.defaultProps = {
  renderLayoutRect: false,
}

const computeStyleFromProps = props => props.style

export default layoutable(computeStyleFromProps, { layoutProp: 'layout' })(FlexContainer)
