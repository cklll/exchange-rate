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
                const rate = parseFloat(convert(
                    1,
                    this.state.rates[date][this.props.from],
                    this.state.rates[date][this.props.to],
                )).toFixed(5);
                let change = '-';
                if (prevRate !== null) {
                    if (rate > prevRate) {
                        change = '<svg xmlns="http://www.w3.org/2000/svg" fill="green" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0l8 9h-6v15h-4v-15h-6z"></path></svg>';
                    } else if (rate < prevRate) {
                        change = '<svg xmlns="http://www.w3.org/2000/svg" fill="red" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24l-8-9h6v-15h4v15h6z"/></svg>';
                    }
                }
                prevRate = rate;
                return (
                    <tr key={date}>
                        <td>{date}</td>
                        <td>{rate}</td>
                        <td dangerouslySetInnerHTML={{ __html: change }} />
                    </tr>
                )
            })
        }
        return (
            <div className={"history container " + this.props.from + "-to-" + this.props.to}>
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