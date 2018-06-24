import React, { Component } from 'react';
import { DropdownButton, MenuItem, Grid, Row, Col } from 'react-bootstrap';


class Converter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fromCurrency: "HKD",
            toCurrency: "USD",
            amount: 1,
            rate: 7.8,

            currencies: {
                USD: {
                    flag: 'us',
                    rateToUSD: 1, 
                }, 
                HKD: {
                    flag: 'hk',
                    rateToUSD: 7.8, /* 7.8HKD = 1USD */
                }, 
                EUR: {
                    flag: 'eu',
                    rateToUSD: 0.86,
                }, 
                GBP: {
                    flag: 'gb',
                    rateToUSD: 0.75,
                }, 
            }
        };

        this.handleamountChange = this.handleamountChange.bind(this);
        this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
        this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
        this.updateRate = this.updateRate.bind(this);
        this.swapCurrency = this.swapCurrency.bind(this);
    }

    componentDidMount() {
        this.updateRate();
    }

    swapCurrency() {
        this.setState({
            toCurrency: this.state.fromCurrency,
            fromCurrency: this.state.toCurrency,
        }, () => this.updateRate());
    }

    updateRate() {
        // currency1 => USD => currency2
        this.setState({
            rate: 1 / this.state.currencies[this.state.fromCurrency]['rateToUSD'] * this.state.currencies[this.state.toCurrency]['rateToUSD'],
        })
    }
    
    handleamountChange(event) {
        const value = event.target.value;
        this.setState({
            amount: value,
        })
    }

    handleFromCurrencyChange(currency) {
        console.log(currency);
        this.setState({
            fromCurrency: currency
        }, () => this.updateRate());
    }
    handleToCurrencyChange(currency) {
        this.setState({
            toCurrency: currency
        }, () => this.updateRate());
    }

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    render() {

        const fromDropdownItems = Object.keys(this.state.currencies).map((currency, index) => {
            const flag = this.state.currencies[currency]['flag'];
            return (
                <MenuItem key={currency} eventKey={currency}
                    onSelect={this.handleFromCurrencyChange}>
                    <img src="../assets/blank.gif" className={"flag flag-"+flag} alt={currency} />
                    {currency}
                </MenuItem>
            )
        });
        const toDropdownItems = Object.keys(this.state.currencies).map((currency, index) => {
            const flag = this.state.currencies[currency]['flag'];
            return (
                <MenuItem key={currency} eventKey={currency}
                onSelect={this.handleToCurrencyChange}>
                    <img src="../assets/blank.gif" className={"flag flag-"+flag} alt={currency} />
                    {currency}
                </MenuItem>
            )
        });

        const toFlag = this.state.currencies[this.state.toCurrency]['flag'];
        const fromFlag = this.state.currencies[this.state.fromCurrency]['flag'];

        return (
            <div className="converter container">
                <form>
                    <Grid>
                        <Row className="show-grid form-group">
                            <Col xs={4} xsOffset={3}>
                                <input type="number" className="form-control"
                                        onChange={this.handleamountChange}
                                        value={this.state.amount} />
                                <p className={"error" + (this.isNumeric(this.state.amount) ? '' : ' show')}>
                                    Please input a number
                                </p>
                            </Col>
                            <Col xs={2}>
                                <DropdownButton
                                    bsStyle='info'
                                    title={
                                        <span>
                                            <img src="../assets/blank.gif" 
                                                    className={"flag flag-"+fromFlag} alt={this.state.fromCurrency} />
                                            {this.state.fromCurrency}
                                        </span>
                                    }
                                    id='fromDropwdown'>
                                    {fromDropdownItems}
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row>

                            <Col xs={4} xsOffset={3} className="equal-to">
                                <button type="button" className="btn btn-secondary"
                                    onClick={this.swapCurrency}>&#x21C5;</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} xsOffset={3}>
                                <input type="text" readOnly  className="form-control"
                                        value={this.state.rate * this.state.amount} />
                            </Col>
                            <Col xs={2}>
                                <DropdownButton
                                    bsStyle='info'
                                    title={
                                        <span>
                                            <img src="../assets/blank.gif" 
                                                    className={"flag flag-"+toFlag} alt={this.state.toCurrency} />
                                            {this.state.toCurrency}
                                        </span>
                                    }
                                    id='toDropwdown'>
                                    {toDropdownItems}
                                </DropdownButton>
                            </Col>
                        </Row>
                    </Grid>
                </form>
            </div>
        )
    }
}

export default Converter;