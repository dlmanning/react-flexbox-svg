/* eslint react/prop-types: "off" */

import React from 'react'
import PropTypes from 'prop-types'
import LayoutRect from './layout-rect'

// Higher-order component for a flex item or container. Returns a function
// which returns a function which wraps a component, so you need to invoke it
// twice. First with a `computeStyleFromProps` function and `options`, and
// then with the component you wish to wrap. (This is for compatibility with
// ES7 decorators.)
//
// You must enclose the tree containing your Layoutable components in a
// FlexContext component.
//
// Layoutable(computeStyleFromProps, options)(Component)
//
// computeStyleFromProps: (Optional) A function which receives props and uses
//   those to compute the flex layout parameters, such as width, height,
//   margin, and flexDirection. This runs before the component renders, so you
//   won't have access to the component instance, only the props.
//
// options: (Optional) An object:
//   - layoutProp: (Optional) When set, the computed layout will be passed to
//     the wrapped component, with a prop of this name. Use this to get
//     access to the layout inside the wrapped component. See LayoutRect for an
//     example of how this works.
//   - renderLayoutRect: (Optional) If true, a rectangle is rendered occupying
//     the computed layout area. The rect is added to the DOM but by default is
//     not visible. For a visible layout rect, also set layoutRectProps.
//   - layoutRectProps: (Optional) Additional properties passed to the layout
//     rectangle. e.g. { stroke: 'maroon', strokeWidth: 3, fill: 'red' }
//
// Component: The React component to wrap.
//
// This used to be called FlexBox. The coupling between Layoutable and FlexBox
// is largely unchanged from the original.

const getDisplayName = Component => Component.displayName || Component.name || 'Component'

const Layoutable = (computeStyleFromProps = props => {}, options) =>
  Composed => {
    const Wrapped = class extends React.Component {

      getMyLayout (layout) {
        this.pathToNode.forEach(childIndex => {
          layout = layout.children[childIndex]
        })

        return layout
      }

      constructor (props, context) {
        super(props)

        this.displayName = `Layoutable(${getDisplayName(Composed)})`

        this.computeStyleFromProps = computeStyleFromProps
        this.options = options || {}

        this.styleTools = {}

        this.state = {
          layout: { top: 0, left: 0, width: 0, height: 0 },
        }

        this.handleLayoutCalculation = this.handleLayoutCalculation.bind(this)
      }

      handleLayoutCalculation (layout) {
        this.setState({ layout: this.getMyLayout(layout).layout })
      }

      beginLayoutCalculation (props) {
        props = props || this.props

        const style = this.computeStyleFromProps(props);

        ({ setStyle: this.styleTools.setStyle,
          path: this.pathToNode } = this.context.styleTools.setStyle(style))

        this.context.waitForLayoutCalculation(this.handleLayoutCalculation)
      }

      componentWillMount () {
        this.beginLayoutCalculation()
      }

      componentWillReceiveProps (nextProps) {
        this.beginLayoutCalculation(nextProps)
      }

      getChildContext () {
        return {
          styleTools: this.styleTools,
        }
      }

      render () {
        const transformation = `translate(${this.state.layout.left},${this.state.layout.top})`

        const layoutRect = (
          <LayoutRect
            layout={ this.state.layout }
            { ...this.options.layoutRectProps } />
        )

        let layoutProp = {}
        if (this.options.layoutProp) {
          layoutProp = { [this.options.layoutProp]: this.state.layout }
        }

        return (
          <g id={ this.props.id } transform={ transformation }>
            { this.options.renderLayoutRect ? layoutRect : null }
            <Composed { ...layoutProp } { ...this.props } />
          </g>
        )
      }

    }

    Wrapped.contextTypes = {
      styleTools: PropTypes.object.isRequired,
      waitForLayoutCalculation: PropTypes.func.isRequired,
      deregister: PropTypes.func.isRequired,
    }

    Wrapped.childContextTypes = {
      styleTools: PropTypes.object.isRequired,
    }

    return Wrapped
  }

export default Layoutable
