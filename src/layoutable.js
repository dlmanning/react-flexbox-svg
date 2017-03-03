/* eslint react/prop-types: "off" */

import React from 'react'
import LayoutRect from './layout-rect'

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
      styleTools: React.PropTypes.object.isRequired,
      waitForLayoutCalculation: React.PropTypes.func.isRequired,
      deregister: React.PropTypes.func.isRequired,
    }

    Wrapped.childContextTypes = {
      styleTools: React.PropTypes.object.isRequired,
    }

    return Wrapped
  }

export default Layoutable
