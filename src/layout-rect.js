import React from 'react'

const LayoutRect = props => {
  const { layout } = props

  const passthroughProps = Object.assign({}, props)
  delete passthroughProps.layout

  const extraProps = Object.assign({}, LayoutRect.defaultFormat, passthroughProps)

  return (
    <rect
      className="react-flexbox-svg-layout-rect"
      width={ layout.width }
      height={ layout.height }
      { ...extraProps } />
  )
}

LayoutRect.defaultFormat = { fill: 'transparent' }

LayoutRect.propTypes = {
  layout: React.PropTypes.object.isRequired,
}

export default LayoutRect
