# Exchange Rate Web Application
A full stack web application that allows users to check the current & historic exchange rates of different currencies.

Supported currencies:
- EUR
- GBP
- HKD
- USD

Exchange rates data fetched from [open exchange rates](https://openexchangerates.org/) and updated every hour

## Technical choices
Three-tier architecture with MERN stack.

#### MongoDB
Store historical data retrieved from open exchange rates API.

#### ExpressJS
Handle routing.

#### React
Provide client side single page application.

#### NodeJS
Handle API request and client page.

#### Selenium & Mocha
Automate Provide testing features.


## Setup
#### Initial MERN setup (reference only)
https://blog.cloudboost.io/creating-your-first-mern-stack-application-b6604d12e4d3

#### Installation
```
git clone https://github.com/cklll/exchange-rate.git
cd exchange-rate
```
Copy `example.env` to `.env` and set the corresponding values.
```
npm install
```
**Run in development mode (auto rebuild)**  
```
npm run start-dev
```

#### Test Application
This will run in development environment and use data from development database.

**Test server response**
```
npm run test-server
```
**End-to-end test**
```
npm run test-end-to-end
```
**Run both server and end-to-end tests**
``` 
npm run test
```
**End to end testing uses Selenium and requires Firefox webdriver. The driver is available [here](https://www.seleniumhq.org/download/)**


#### Production Deployment
For Heroku deployment, set the environemt variables as in ```.env``` before deploying.

## [Live Demo](https://exchange-rate-ckl.herokuapp.com/)
I am using a free heroku hosting so it may take a while to load for the first time.

#### [My Profile Website](https://www.chankinlong.com/)

#### Other project
[A simple shopping web application that I built recently to learn Angular](https://github.com/cklll/shopping-webapp)
