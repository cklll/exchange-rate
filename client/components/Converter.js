import React, { Component } from 'react';
import { DropdownButton, MenuItem, Grid, Row, Col } from 'react-bootstrap';
const fx = require('money');


class Converter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fromCurrency: "HKD",
            toCurrency: "USD",
            targetAmount: 0,
        };
        this.flags = {
            USD: 'us',
            HKD: 'hk',
            EUR: 'eu',
            GBP: 'gb',
        }
        this.rates = {
            EUR : 0.745101, // eg. 1 USD === 0.745101 EUR
            GBP : 0.647710, // etc...
            HKD : 7.781919,
            USD : 1, 
        }
        this.fromAmountRef = React.createRef();

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
        this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
        this.swapCurrency = this.swapCurrency.bind(this);
        
        fx.rates = this.rates
        fx.base = "USD";
    }

    componentDidMount() {
        this.handleUpdate();
    }

    swapCurrency() {
        this.setState({
            toCurrency: this.state.fromCurrency,
            fromCurrency: this.state.toCurrency,
        }, () => this.handleUpdate());
    }

    handleUpdate() {
        if (this.isNumeric(this.fromAmountRef.current.value)) {
            const targetAmount = fx.convert(parseFloat(this.fromAmountRef.current.value), {
                from: this.state.fromCurrency, 
                to: this.state.toCurrency
            });
            this.setState({
                targetAmount: targetAmount,
            })
        } else {
            this.setState({
                targetAmount: 0,
            })
        }
    }

    handleFromCurrencyChange(currency) {
        this.setState({
            fromCurrency: currency
        }, () => this.handleUpdate());
    }
    handleToCurrencyChange(currency) {
        this.setState({
            toCurrency: currency
        }, () => this.handleUpdate());
    }

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    render() {

        const fromDropdownItems = Object.keys(this.rates).map((currency, index) => {
            const flag = this.flags[currency];
            return (
                <MenuItem key={currency} eventKey={currency}
                    onSelect={this.handleFromCurrencyChange}>
                    <img src="../assets/blank.gif" className={"flag flag-"+flag} alt={currency} />
                    {currency}
                </MenuItem>
            )
        });
        const toDropdownItems = Object.keys(this.rates).map((currency, index) => {
            const flag = this.flags[currency];
            return (
                <MenuItem key={currency} eventKey={currency}
                onSelect={this.handleToCurrencyChange}>
                    <img src="../assets/blank.gif" className={"flag flag-"+flag} alt={currency} />
                    {currency}
                </MenuItem>
            )
        });

        const toFlag = this.flags[this.state.toCurrency];
        const fromFlag = this.flags[this.state.fromCurrency];

        const showError = this.fromAmountRef.current === null || this.isNumeric(this.fromAmountRef.current.value);

        return (
            <div className="converter container">
                <form>
                    <Grid>
                        <Row className="show-grid form-group">
                            <Col xs={4} xsOffset={3}>
                                <input type="number" className="form-control"
                                        onChange={this.handleUpdate}
                                        defaultValue={1}
                                        ref={this.fromAmountRef} />
                                <p className={"error" + (showError ? '' : ' show')}>
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
                                        value={this.state.targetAmount} />
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