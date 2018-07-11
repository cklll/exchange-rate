const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const chai = require('chai');
const expect = chai.expect;
const http = require('http');

const port = process.env.PORT || 8000;

const driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

let rates;
describe('modify input value', () => {
    before((done) => {

        // using async in mocha
        // https://github.com/mochajs/mocha/issues/2407
        (async () => {
            rates = await new Promise((resolve, reject) => {
                http.get(`http://localhost:${port}/api/rates`, function (res) {
                    let body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });

                    res.on('end', function () {
                        const data = JSON.parse(body);
                        resolve(data.rates);
                    });
                });
            });
            driver.navigate().to(`http://localhost:${port}/`)
                .then(() => {
                    done();
                });
        })();

    });

    it('change value to 10', function (done) {
        driver.executeScript("document.querySelector('.row:first-child  .col-xs-12 input').value = ''");
        driver.findElement(By.css('.row:first-child  .col-xs-12 input')).sendKeys('10')

        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
            .then(rate => {
                const expectedResult = (1 / rates['HKD'] * 10).toFixed(5);
                expect(rate).to.equal(expectedResult);
                done();
            });
    });

    it('change value to 25', function (done) {
        driver.executeScript("document.querySelector('.row:first-child  .col-xs-12 input').value = ''");
        driver.findElement(By.css('.row:first-child  .col-xs-12 input')).sendKeys('25')
        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
            .then(rate => {
                const expectedResult = (1 / rates['HKD'] * 25).toFixed(5);
                expect(rate).to.equal(expectedResult);
                done();
            });
    });

    it('change value to non-number', function (done) {
        driver.findElement(By.css('.row:first-child  .col-xs-12 input')).sendKeys('dfsgsdfg')
        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
            .then(rate => {
                const expectedResult = '0';
                expect(rate).to.equal(expectedResult);
                driver.findElements(By.css('p.error.show')).then(found => {
                    expect(!!found.length).to.equal(true);
                    done();
                });
            });
    });

    it('change value to negative', function (done) {
        driver.executeScript("document.querySelector('.row:first-child  .col-xs-12 input').value = ''");
        driver.findElement(By.css('.row:first-child  .col-xs-12 input')).sendKeys('-534')
        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
            .then(rate => {
                const expectedResult = '0';
                expect(rate).to.equal(expectedResult);
                driver.findElements(By.css('p.error.show')).then(found => {
                    expect(!!found.length).to.equal(true);
                    done();
                });


            });
    });

    it('change back value to number', function (done) {
        driver.executeScript("document.querySelector('.row:first-child  .col-xs-12 input').value = ''");
        driver.findElement(By.css('.row:first-child  .col-xs-12 input')).sendKeys('556434')
        driver.findElement(By.css('.row:last-child  .col-xs-12 input')).getAttribute('value')
            .then(rate => {
                const expectedResult = (1 / rates['HKD'] * 556434).toFixed(5);
                expect(rate).to.equal(expectedResult);
                driver.findElements(By.css('p.error.show')).then(found => {
                    expect(!!found.length).to.equal(false);
                    done();
                });
            });
    });


    after((done) => {
        driver.quit().then(() => done());
    });
});