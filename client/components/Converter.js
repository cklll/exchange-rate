import React, { Component } from 'react';
import { DropdownButton, MenuItem, Grid, Row, Col } from 'react-bootstrap';
import History from './History';
import { convert } from '../utils/RateConverter';


class Converter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromCurrency: "HKD",
            toCurrency: "USD",
            targetAmount: 0,
            isLoading: true,
            rates: {
                USD:1
            }
        };
        this.flags = {
            USD: 'us',
            HKD: 'hk',
            EUR: 'eu',
            GBP: 'gb',
        }
        this.fromAmountRef = React.createRef();
        
    }

    componentDidMount() {
        this.getCurrentRates();
    }

    getCurrentRates = () => {
        fetch('/api/rates')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    rates: data['rates']
                })
                this.handleUpdate();
                this.setState({
                    isLoading: false,
                })
            });
    }

    swapCurrency = () => {
        this.setState({
            toCurrency: this.state.fromCurrency,
            fromCurrency: this.state.toCurrency,
        }, () => this.handleUpdate());
    }

    handleUpdate = () => {
        if (this.isPositiveNumber(this.fromAmountRef.current.value)) {
            const targetAmount = convert(
                parseFloat(this.fromAmountRef.current.value),
                this.state.rates[this.state.fromCurrency],
                this.state.rates[this.state.toCurrency],
            );
            this.setState({
                targetAmount: targetAmount,
            })
        } else {
            this.setState({
                targetAmount: 0,
            })
        }
    }

    handleFromCurrencyChange = (currency) => {
        this.setState({
            fromCurrency: currency
        }, () => this.handleUpdate());
    }
    handleToCurrencyChange = (currency) => {
        this.setState({
            toCurrency: currency
        }, () => this.handleUpdate());
    }

    isPositiveNumber = (number) => {
        return !isNaN(parseFloat(number)) && isFinite(number) && number >= 0;
    }

    render() {

        const fromDropdownItems = Object.keys(this.flags).map((currency, index) => {
            const flag = this.flags[currency];
            return (
                <MenuItem key={currency} eventKey={currency}
                    onSelect={this.handleFromCurrencyChange}>
                    <img src="../assets/blank.gif" className={"flag flag-"+flag} alt={currency} />
                    {currency}
                </MenuItem>
            )
        });
        const toDropdownItems = Object.keys(this.flags).map((currency, index) => {
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

        const showError = this.fromAmountRef.current === null || this.isPositiveNumber(this.fromAmountRef.current.value);

        const targetValue = (this.state.isLoading ? 'loading...' : this.state.targetAmount);
        return (
            <div>
                <div className="converter container">
                    <form>
                        <Grid>
                            <Row className="show-grid form-group">
                                <Col xs={4} xsOffset={3}>
                                    <input type="number" className="form-control"
                                            onChange={this.handleUpdate}
                                            defaultValue={1}
                                            ref={this.fromAmountRef}
                                            min="0" />
                                    <p className={"error" + (showError ? '' : ' show')}>
                                        Please input a positive number
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
                                    <button type="button" className="btn btn-primary btn-swap"
                                        onClick={this.swapCurrency}>&#x21C5;</button>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4} xsOffset={3}>
                                    <input type="text" readOnly  className="form-control"
                                            value={targetValue} />
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

                <hr className="container" />
                
                <History from={this.state.fromCurrency} to={this.state.toCurrency} />
            </div>
        )
    }
}

export default Converter;