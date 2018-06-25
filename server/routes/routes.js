const express = require('express');
const router = express.Router();

const oxr = require('open-exchange-rates');
oxr.set({ app_id: '1e537562f00543419433fec9b58c6aa1' })

let cached_rates_info = {}
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
  nextUpdateTimestamp = oxr.timestamp + 3600000;
}

getOXRData();

router.get('/', (req, res) => {
  res.render('index')
});

// get all rates
router.get('/api/rates', async (req, res) => {
  if (nextUpdateTimestamp >  Date.now()) {
    await getOXRData();
  }
  res.send(cached_rates_info);  
});

// get historic data
// e.g. /api/history/currency=USD
router.get('/api/history', async (req, res) => {  
  let currency = req.query.currency;

  if (currency === null || currency === undefined) {
    return res.send({
      error: "currency not specified"
    }, 400);
  } 
  
  currency = currency.toUpperCase();
  if (availableCurrencies.indexOf(currency) === -1) { // not found
    return res.send({
      error: "currency not available"
    }, 404);
  }

  return res.send("OK");
  
});

router.get('*', function(req, res){
  res.send({
    error: "route not found"
  }, 404);
});


module.exports = router;