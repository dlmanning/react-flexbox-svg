import React from 'react'
import PropTypes from 'prop-types'
import EventEmitter from 'wolfy87-eventemitter'
import computeLayout from 'css-layout'

// FlexContext is responsible for computing layout. It's tightly coupled with
// Layoutable.
//
// The setStyle function is difficult to understand, and so is the flow of
// control between the context and the Layoutable. This file is substantially
// unchanged from the original.

const setStyle = (style = {}, styles, path = []) => {
  if (styles.style === undefined) {
    styles.style = style
  } else {
    const childStyle = { style: style, children: [] }
    styles.children.push(childStyle)
    path.push(styles.children.length - 1)

    styles = childStyle
  }

  return {
    path: path.slice(),
    setStyle: function (childStyle) {
      return setStyle(childStyle, styles, path.slice())
    },
  }
}

export default class FlexContext extends React.Component {

  constructor (props, context) {
    super(props)

    this.layoutNotifier = new EventEmitter()

    this.stylesRoot = { children: [] }
    this.styleTools = {}

    this.deregister = this.deregister.bind(this)
    this.waitForLayoutCalculation = this.waitForLayoutCalculation.bind(this)
  }

  deregister (cb) {
    this.layoutNotifier.removeListener('layout-update', cb)
  }

  waitForLayoutCalculation (cb) {
    this.layoutNotifier.once('layout-update', cb)
  }

  getChildContext () {
    return {
      styleTools: this.styleTools,
      waitForLayoutCalculation: this.waitForLayoutCalculation,
      deregister: this.deregister,
    }
  }

  render () {
    return <g>{ this.props.children }</g>
  }

  startNewStyleTree () {
    this.stylesRoot = { children: [] };
    ({ setStyle: this.styleTools.setStyle } = setStyle(undefined, this.stylesRoot))
  }

  computeLayoutAndBroadcastResults () {
    computeLayout(this.stylesRoot)
    this.layoutNotifier.emit('layout-update', this.stylesRoot)
  }

  componentWillMount () {
    this.startNewStyleTree()
  }

  componentDidMount () {
    this.computeLayoutAndBroadcastResults()
  }

  componentWillUpdate () {
    this.startNewStyleTree()
  }

  componentDidUpdate () {
    this.computeLayoutAndBroadcastResults()
  }

}

FlexContext.childContextTypes = {
  styleTools: PropTypes.object.isRequired,
  waitForLayoutCalculation: PropTypes.func.isRequired,
  deregister: PropTypes.func.isRequired,
}

FlexContext.propTypes = {
  children: PropTypes.node,
}
