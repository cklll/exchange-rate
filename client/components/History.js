import React, { Component } from 'react';
const fx = require('money');

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rates: {},
            from: props.from,
            to: props.to,
        }
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
            this.getHistory();
        }
    }

    getHistory = () => {
        fetch(`http://localhost:8000/api/history?from=${this.props.from}&to=${this.props.to}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // fx.rates = data['rates'];
                this.setState({
                    rates: data['rates'],
                    isLoading: false,
                })
            });
    }

    render() {
        console.log(this.state.rates)
        let rows = [];
        if (true) {
            const dates = Object.keys(this.state.rates);
            dates.sort();
            let prevRate = null;
            rows = dates.map(date => {
                fx.rates = this.state.rates[date];
                const rate = fx.convert(1, {
                    from: this.props.from, 
                    to: this.props.to
                });
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