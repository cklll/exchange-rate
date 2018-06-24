import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <header>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Currency Exchange Rate</a>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li><a target="_blank" href="https://github.com/cklll/exchange-rate">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;