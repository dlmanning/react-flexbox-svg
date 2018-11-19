# react-flexbox-svg

[![npm](https://img.shields.io/badge/npm%20install-%40metabolize%2Freact--flexbox--svg-f441b8.svg?style=flat-square)][npm]
[![version](https://img.shields.io/npm/v/@metabolize/react-flexbox-svg.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/@metabolize/react-flexbox-svg.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/metabolize/react-flexbox-svg.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://www.npmjs.com/package/@metabolize/react-flexbox-svg
[build]: https://circleci.com/gh/metabolize/react-flexbox-svg/tree/master
[prettier]: https://prettier.io/

Flexbox for SVG in React, using [css-layout][].

css-layout is Facebook's JavaScript reimplementation of CSS which is now part
of [Yoga][].

Based on [react-flexbox-svg][dlmanning/react-flexbox-svg] by
[David Manning][dlmanning].

[css-layout]: https://www.npmjs.com/package/css-layout
[yoga]: https://facebook.github.io/yoga/
[dlmanning/react-flexbox-svg]: https://github.com/dlmanning/react-flexbox-svg
[dlmanning]: https://github.com/dlmanning

## Features

- Define item layout statically or compute it from props.
- Render layout rectangles for debugging (visible or not).
- Pass layout into child props if needed.
- No magic.
- ES7 decorator ready.

## Usage

```jsx
import React from 'react'
import { FlexContext, FlexContainer } from 'react-flexbox-svg'

class StackedItemCollection extends React.Component {
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
```

```jsx
class Item extends React.Component {
  render() {
    const { height } = Item.layout

    return <rect height={height} width="100%" stroke="black" strokeWidth="3" />
  }
}
Item.layout = { margin: 25, height: 50 }

export default layoutable(props => Item.layout)(Item)
```

As a functional component:

```jsx
const Item = layoutable(props => ({ margin: 10, height: 50 }))(() => (
  <rect height="50" width="100%" stroke="black" strokeWidth="3" />
))
```

Using ES7 decorators:

```jsx
@layoutable(props => Item.layout)
class Item extends React.Component {
  render() {
    const { height } = Item.layout

    return <rect height={height} width="100%" stroke="black" strokeWidth="3" />
  }
}
Item.layout = { margin: 10, height: 100 }
```

In the [examples](examples/) folder is a more interesting example featuring a
[dynamic collection](examples/dynamic-collection.js).

## Installation

```sh
npm install --save babel-runtime react-flexbox-svg
```

## Contribute

- Issue Tracker: https://github.com/paulmelnikow/react-flexbox-svg/issues
- Source Code: https://github.com/paulmelnikow/react-flexbox-svg/

Pull requests welcome!

## Support

If you are having issues, please let me know.

## License

This projects is licensed under the ISC license.
