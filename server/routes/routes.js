const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const http = require('http');

const historySchema = require('../../models/RateHistory');

const oxrKey = process.env.OXR_APP_ID;

let cached_rates_info = {};
let nextUpdateTimestamp = Date.now();  // initialize next current timestamp to current time

const availableCurrencies = ['HKD', 'USD', 'GBP', 'EUR'];

const getOXRLatest = async () => {
  await new Promise(resolve => {
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
      res.on('end', function() {
        const jsonData = JSON.parse(body)
        const availableRates = availableCurrencies.reduce((a, e) => (a[e] = jsonData["rates"][e], a), {});
        cached_rates_info = {
            rates: availableRates,
            base: jsonData["base"],
        };
        nextUpdateTimestamp = jsonData["timestamp"] + 3600000;
        resolve();
      });
    });
  })
}

const getHistorical = async (startDate, endDate, currencies) => {
  
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
    if (rates[dateString] === undefined || rates[dateString] === null) {
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
          res.on('end', function() {
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
                function(err, doc) {
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

getOXRLatest();

router.get('/', (req, res) => {
  res.render('index')
});

// get all rates
router.get('/api/rates', async (req, res) => {
  if (nextUpdateTimestamp >  Date.now() || 
      (Object.keys(cached_rates_info).length === 0 && cached_rates_info.constructor === Object)) {
    await getOXRLatest();
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
  
  const rates = await getHistorical(new Date(startDate), new Date(endDate), [from, to])

  return res.send({
    rates: rates,
    base:"USD",
  });
});



router.get('*', function(req, res){
  res.status(404).send({
    error: "route not found"
  });
});


module.exports = router;