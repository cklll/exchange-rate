const express = require('express');
const router = express.Router();
const getHistorical = require('../utils/FetchRate').getHistorical;
const getOXRLatest = require('../utils/FetchRate').getOXRLatest;

let cached_rates_info = {};
let nextUpdateTimestamp = Date.now();  // initialize next current timestamp to current time

const availableCurrencies = ['HKD', 'USD', 'GBP', 'EUR'];

router.get('/', (req, res) => {
  res.render('index')
});

// get all rates
router.get('/api/rates', async (req, res) => {
  if (nextUpdateTimestamp >  Date.now() || 
      (Object.keys(cached_rates_info).length === 0 && cached_rates_info.constructor === Object)) {
    const data = await getOXRLatest();
    cached_rates_info['rates'] = data['rates'];
    cached_rates_info['base'] = data['base'];
    nextUpdateTimestamp = data['timestamp'];
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