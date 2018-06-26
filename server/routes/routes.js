const express = require('express');
const router = express.Router();
const oxr = require('open-exchange-rates');
const mongoose = require('mongoose');
const historySchema = require('../../models/RateHistory');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
oxr.set({ app_id: process.env.OXR_APP_ID });

let cached_rates_info = {};
let nextUpdateTimestamp = Date.now();  // initialize next current timestamp to current time

const availableCurrencies = ['HKD', 'USD', 'GBP', 'EUR'];

const getOXRData = async () => {
  await new Promise(resolve => {
    oxr.latest(() => resolve());
  });

  // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
  const availableRates = availableCurrencies.reduce((a, e) => (a[e] = oxr.rates[e], a), {});
  cached_rates_info = {
    rates: availableRates,
    base: oxr.base,
  }
  
  // update every hour
  nextUpdateTimestamp = oxr.timestamp + 3600000;
}

const getHistoricalAsync = async (startDate, endDate, currencies) => {
  
  // check db first
  const rates = {}
  for (let currency of currencies) {
    const OldHistory = mongoose.model(currency, historySchema, currency);
    const startDateNumber = startDate.toISOString().split('T')[0].replace(/-/g, '');
    const endDateNumber = endDate.toISOString().split('T')[0].replace(/-/g, '');
    const histories = await OldHistory.find({
      $and: [{
        dateNumber: { $gte: startDateNumber },
        dateNumber: { $lte: endDateNumber },
      }]
    });

    histories.map(history => {
      const dateString = history['dateString'];
      if (rates[dateString] === undefined) {
        rates[dateString] = {};
      }
      rates[dateString][currency] = history['rateToUSD'];
    })
  }

  while (startDate <= endDate) {
    const dateString = startDate.toISOString().split('T')[0]; //YYYY-MM-DD 

    // not found in db
    if (rates[dateString] === undefined) {
      const oxrHistory = require('open-exchange-rates');
      oxrHistory.set({ app_id: process.env.OXR_APP_ID });
      await new Promise(resolve => {
        oxrHistory.historical(dateString, () => resolve());
      });
      for (let currency of availableCurrencies) {
        const History = mongoose.model(currency, historySchema, currency);
        const history = new History({
          dateString: dateString,
          dateNumber: parseInt(dateString.replace(/-/g, '')),
          rateToUSD: oxrHistory.rates[currency]
        });
        history.save(function(err) {
          if (err) { /* unique index on date may cause error, just ignore it */ }
        });
      }

      rates[dateString] = {};
      for (let currency of currencies) {
        rates[dateString][currency] = oxrHistory.rates[currency];
      }
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return rates;
}

getOXRData();

router.get('/', (req, res) => {
  res.render('index')
});

// get all rates
router.get('/api/rates', async (req, res) => {
  if (nextUpdateTimestamp >  Date.now() || 
      (Object.keys(cached_rates_info).length === 0 && cached_rates_info.constructor === Object)) {
    await getOXRData();
  }
  res.send(cached_rates_info);  
});

// get historic data
// e.g. /api/history/from=USD&to=HKD
router.get('/api/history', async (req, res) => {  
  let from = req.query.from;
  let to = req.query.to;

  if (from === null || from === undefined || to === undefined || to === undefined) {
    return res.status(400).send({
      error: "currency not specified"
    });
  } 
  
  from = from.toUpperCase();
  to = to.toUpperCase();
  if (availableCurrencies.indexOf(from) === -1 || availableCurrencies.indexOf(to) === -1) { // not found
    return res.status(404).send({
      error: "currency not available"
    });
  }

  const startDate = new Date();
  const endDate = new Date();

  endDate.setDate(startDate.getDate() - 1);
  startDate.setDate(startDate.getDate() - 30);
  
  const rates = await getHistoricalAsync(new Date(startDate), new Date(endDate), [from, to])

  return res.send({
    rates: rates,
    base:"USD",
  });
});



router.get('*', function(req, res){
  res.send({
    error: "route not found"
  }, 404);
});


module.exports = router;