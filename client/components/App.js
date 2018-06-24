import React, { Component } from 'react';

import '../css/App.css';
import Header from './Header';
import Converter from './Converter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="MainContainer">
          <Converter />
        </div>
      </div>
    );
  }
}

export default App;
