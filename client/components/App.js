import React, { Component } from 'react';

import '../css/app.css';
import Header from './header';
import Converter from './converter';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Header />
                <div className="main-container">
                    <Converter />
                </div>
            </div>
        );
    }
}

export default App;
