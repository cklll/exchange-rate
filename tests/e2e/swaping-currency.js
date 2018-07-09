const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const chai = require('chai');
const expect = chai.expect;
const http = require('http');

const port =  process.env.PORT || 8000;

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

let rates;
let history;
describe('swap default currencies', () => {
    before((done) => {
        // using async in mocha
        // https://github.com/mochajs/mocha/issues/2407
        (async () => {
            rates = await new Promise ((resolve, reject) => {
                http.get(`http://localhost:${port}/api/rates`, function(res){
                    let body = '';
                    res.on('data', function(chunk){
                        body += chunk;
                    });
                
                    res.on('end', function(){
                        const data = JSON.parse(body);
                        resolve(data.rates);
                    });
                });
            });
            history = await new Promise ((resolve, reject) => {
                http.get(`http://localhost:${port}/api/history?from=USD&to=HKD`, function(res){
                    let body = '';
                    res.on('data', function(chunk){
                        body += chunk;
                    });
                
                    res.on('end', function(){
                        const data = JSON.parse(body);
                        resolve(data.rates);
                    });
                });
            });
            driver.navigate().to(`http://localhost:${port}/`)
            .then(() => {
                driver.findElement(By.css('.btn-swap')).click();
                driver.wait(until.elementLocated(By.css('.history.USD-to-HKD tbody td:nth-child(2)')))
                    .then(() => {
                        done();
                    });
            });
          })();
       
    });

    it('to button text becamse HKD', function(done) {
        driver.findElement(By.css('#toDropwdown span span')).getText()
                .then(fromCurrency => {
                    const expectedResult = 'HKD';
                    expect(fromCurrency).to.equal(expectedResult);  
                    done();
                })
    });

    it('from button text becamse USD', function(done) {
        driver.findElement(By.css('#fromDropwdown span span')).getText()
                .then(fromCurrency => {
                    const expectedResult = 'USD';
                    expect(fromCurrency).to.equal(expectedResult);  
                    done();
                })
    });

    it('load current rate of USD to HKD', function(done) {
        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
                .then(rate => {
                    const expectedResult = (rates['HKD']).toFixed(5);
                    expect(rate).to.equal(expectedResult);  
                    done();
                });
    });

    it('load historical rates of USD to HKD', function(done) {
        const dates = Object.keys(history);
        dates.sort();
        dates.reverse();

        driver.findElements(By.css('.history tbody td:nth-child(2)'))
                .then(elements => {

                    const pendingHistoricalRates = elements.map(function (element) {
                        return element.getText();
                    });
                
                    Promise.all(pendingHistoricalRates).then(function (historicalRates) {
                        for (let i = 0; i < dates.length; i++) {
                            const historicalRate = historicalRates[i];
                            const expectedResult = (history[dates[i]]['HKD']).toFixed(5);
                            expect(historicalRate).to.equal(expectedResult);  
                        }
                        done();
                    });
                });
    });

    after((done) => {
        driver.quit().then(() => done());
    });
});