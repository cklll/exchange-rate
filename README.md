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



## Setup
#### Initial MERN setup (reference only)
https://blog.cloudboost.io/creating-your-first-mern-stack-application-b6604d12e4d3

#### Installation
```
git clone https://github.com/cklll/exchange-rate.git
cd exchange-rate
```
Copy `config.example.json` to `config.development.json`, `config.production.json` and set the corresponding keys. 
```
npm install
npm start
```

#### Test Application
``` TODO ```

#### Production Deployment
``` TODO ```



## Live Demo
I am using a free heroku hosting so it may take a while to load for the first time!

