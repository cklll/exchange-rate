const express = require('express');
const router = express.Router();
const oxr = require('open-exchange-rates');
const mongoose = require('mongoose');
const historySchema = require('../../models/RateHistory');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
console.log(process.env.OXR_APP_ID)
oxr.set({ app_id: process.env.OXR_APP_ID });

let cached_rates_info = {};
let nextUpdateTimestamp = Date.now();  // initialize next current timestamp to current time

const availableCurrencies = ['HKD', 'USD', 'GBP', 'EUR'];

const getOXRData = async () => {
  await new Promise(resolve => {
    oxr.latest(() => resolve());
  });

  // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
  const subsetRates = availableCurrencies.reduce((a, e) => (a[e] = oxr.rates[e], a), {});
  cached_rates_info = {
    rates: subsetRates,
    base: oxr.base,
    timestamp: oxr.timestamp,
  }
  
  // update every hour
  nextUpdateTimestamp = oxr.timestamp + 3600000;
}

const getHistoricalAsync = async (startDate, endDate, currency) => {
  // TODO check db first

  // new, scoped oxr object => make sure concurrent request won't affect oxr (latest)
  const oxrHistory = require('open-exchange-rates');
  oxrHistory.set({ app_id: process.env.OXR_APP_ID });

  const result = {};
  while (startDate <= endDate) {
    const dateString = startDate.toISOString().split('T')[0]; //YYYY-MM-DD 
    // TODO rewrite to promise.all
    await new Promise(resolve => {
      oxrHistory.historical(dateString, () => resolve());
    });

    result[oxrHistory.timestamp] = oxrHistory.rates[currency];
    startDate.setDate(startDate.getDate() + 1);
  }

  // TODO save all to db

  return result;
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
  startDate.setDate(startDate.getDate() - 3);
  
  const rates = {}
  rates[from] = await getHistoricalAsync(new Date(startDate), new Date(endDate), from)
  rates[to] = await getHistoricalAsync(new Date(startDate), new Date(endDate), to)

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