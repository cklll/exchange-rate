
const http = require('http');
const historySchema = require('../../models/RateHistory');
const oxrKey = process.env.OXR_APP_ID;
const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}
  
const availableCurrencies = ['HKD', 'USD', 'GBP', 'EUR'];

const getHistorical = async (startDate, endDate, currencies) => {

    // check db first
    const rates = {}
    for (let currency of currencies) {
        const OldHistory = mongoose.model(currency, historySchema, currency);
        const startDateNumber = startDate.toISOString().split('T')[0].replace(/-/g, '');
        const endDateNumber = endDate.toISOString().split('T')[0].replace(/-/g, '');
        const histories = await OldHistory.find({
            $and: [
                { dateNumber: { $gte: startDateNumber } },
                { dateNumber: { $lte: endDateNumber } },
            ]
        });

        histories.map(history => {
            const dateString = history['dateString'];
            if (rates[dateString] === undefined) {
                rates[dateString] = {};
            }
            if (history['rateToUSD'] === undefined) {
                rates[dateString] = undefined;
            } else {
                rates[dateString][currency] = history['rateToUSD'];
            }
        })
    }

    while (startDate <= endDate) {
        const dateString = startDate.toISOString().split('T')[0]; //YYYY-MM-DD 

        // not found in db
        if (rates[dateString] === undefined || rates[dateString][currencies[0]] === undefined || rates[dateString][currencies[1]] === undefined) {
            await new Promise(resolve => {
                http.get({
                    hostname: `openexchangerates.org`,
                    port: 80,
                    path: `/api/historical/${dateString}.json?app_id=${oxrKey}`,
                }, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', function (data) {
                        body += data;
                    });
                    res.on('end', function () {
                        const jsonData = JSON.parse(body)
                        for (let currency of availableCurrencies) {
                            const History = mongoose.model(currency, historySchema, currency);

                            History.findOneAndUpdate(
                                {
                                    dateNumber: parseInt(dateString.replace(/-/g, ''))
                                },
                                {
                                    dateString: dateString,
                                    dateNumber: parseInt(dateString.replace(/-/g, '')),
                                    rateToUSD: jsonData["rates"][currency]
                                },
                                {
                                    upsert: true
                                },
                                function (err, doc) {
                                    if (err) { console.log(err) }
                                }
                            )
                        }
                        rates[dateString] = {};
                        for (let currency of currencies) {
                            rates[dateString][currency] = jsonData["rates"][currency];
                        }
                    });



                    resolve();
                });
            })
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return rates;
}

const getOXRLatest = async () => {
    return new Promise(resolve => {
        http.get({
            hostname: `openexchangerates.org`,
            port: 80,
            path: `/api/latest.json?app_id=${oxrKey}`,
        }, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {
                const jsonData = JSON.parse(body)
                const availableRates = availableCurrencies.reduce((a, e) => (a[e] = jsonData["rates"][e], a), {});
                resolve({
                    rates: availableRates,
                    base: jsonData["base"],
                    timestamp: jsonData["timestamp"],
                });
            });
        });
    })
}

module.exports = {
    getOXRLatest: getOXRLatest,
    getHistorical: getHistorical,
}