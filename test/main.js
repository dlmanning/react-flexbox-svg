'use strict';

import { default as React, Component } from 'react';
import ReactDOM from 'react-dom';
import Thing from './test.js';

window.React = React;

class App extends Component {
  render () {
    return <Thing />;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
