'use strict';

import { default as React, Component } from 'react';
// import Chessboard from './chessboard.jsx';
import Thing from './test.js';

window.React = React;

class App extends Component {
  render () {
    return <Thing />;
  }
}

React.render(<App />, document.getElementById('app'));