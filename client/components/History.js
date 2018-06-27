import React, { Component } from 'react';
import { convert } from '../utils/RateConverter';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rates: {},
        };
    }

    componentDidMount() {
        this.getHistory();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.to !== this.props.to || nextProps.from !== this.props.from) {
            this.setState({
                isLoading: true,
                rates: {},
            })
            this.props = nextProps;
            this.getHistory();
        }
    }

    getHistory = () => {
        fetch(`/api/history?from=${this.props.from}&to=${this.props.to}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    rates: data['rates'],
                    isLoading: false,
                })
            });
    }

    render() {
        let rows = [];
        if (true) {
            const dates = Object.keys(this.state.rates);
            dates.sort();
            let prevRate = null;
            rows = dates.map(date => {
                const rate = convert(
                    1,
                    this.state.rates[date][from],
                    this.state.rates[date][to],
                );
                let change = '-';
                let changeClass = '';
                if (prevRate !== null) {
                    if (rate > prevRate) {
                        change = '⮝';
                        changeClass = 'text-success';
                    } else if (rate < prevRate) {
                        change = '⮟';
                        changeClass = 'text-danger';
                    }
                }
                prevRate = rate;
                return (
                    <tr key={date}>
                        <td>{date}</td>
                        <td>{rate}</td>
                        <td className={changeClass}>{change}</td>
                    </tr>
                )
            })
        }
        return (
            <div className="history container">
                <h2>History</h2>
                <div className={"loader" + (this.state.isLoading ? " show" : "")}>
                    <div className="loader-inner"></div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                        <th>Date (YYYY-MM-DD) </th>
                        <th>Rate (1 {this.props.from} to {this.props.to}) </th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.reverse()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default History;