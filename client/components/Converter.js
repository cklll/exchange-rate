import React, { Component } from 'react';
import { DropdownButton, MenuItem, Grid, Row, Col } from 'react-bootstrap';


class Converter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fromCurrency: "HKD",
            toCurrency: "USD",
            fromAmount: 1,
            rate: 7.8,
            isLoadingRate: true,
            isLoadingHistory: true,
        };

        this.handleFromAmountChange = this.handleFromAmountChange.bind(this);
        this.swapCurrency = this.swapCurrency.bind(this);
    }
    
    handleFromAmountChange(event) {
        const value = event.target.value;
        this.setState({
            fromAmount: value,
        })
    }

    swapCurrency(event) {
        this.setState({
            isLoadingRate: false,
        })
    }

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    render() {
        let toValue = 'Loading...';
        if (!this.state.isLoadingRate) {
            toValue = this.state.rate * this.state.fromAmount;
        }
        return (
            <div className="converter container">
                <form>
                    <Grid>
                        <Row className="show-grid form-group">
                            <Col xs={4} xsOffset={3}>
                                <input type="number" className="form-control"
                                        onChange={this.handleFromAmountChange}
                                        value={this.state.fromAmount} />
                                <p className={"error" + (this.isNumeric(this.state.fromAmount) ? '' : ' show')}>
                                    Please input a number
                                </p>
                            </Col>
                            <Col xs={2}>
                                <DropdownButton
                                    bsStyle='info'
                                    title='Select'
                                    id='fromDropwdown'>
                                    <MenuItem eventKey="HKD">
                                        <img src="../assets/blank.gif" className="flag flag-hk" alt="Hong Kong" />HKD
                                    </MenuItem>
                                    <MenuItem eventKey="USD">
                                        <img src="../assets/blank.gif" className="flag flag-us" alt="Hong Kong" />USD
                                    </MenuItem>
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row>

                            <Col xs={4} xsOffset={3} className="equal-to">
                                <span>Equals to...</span>
                                <button type="button" className="btn btn-secondary" onClick={this.swapCurrency}>Swap</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} xsOffset={3}>
                                <input type="text" readOnly  className="form-control"
                                        value={toValue} />
                            </Col>
                            <Col xs={2}>
                                <DropdownButton
                                    bsStyle='info'
                                    title='Select'
                                    id='toDropwdown'>
                                    <MenuItem eventKey="HKD">
                                        <img src="../assets/blank.gif" className="flag flag-hk" alt="Hong Kong" />HKD
                                    </MenuItem>
                                    <MenuItem eventKey="USD">
                                        <img src="../assets/blank.gif" className="flag flag-us" alt="Hong Kong" />USD
                                    </MenuItem>
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