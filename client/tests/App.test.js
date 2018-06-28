
import React from 'react';
import App from '../components/App';
import renderer from 'react-test-renderer';

process.on('unhandledRejection', (reason) => {
	console.log('REJECTION', reason)
})

global.fetch = jest.fn().mockImplementation((url) => {
    var p = new Promise((resolve, reject) => {
      resolve({
        json: function() { 
            if (url == '/api/rates') {
                return {
                    base: 'USD',
                    rates: {
                        'USD': 1,
                        'GBP': 2,
                        'EUR': 3,
                        'HKD': 4,
                    }
                }
            } else {
                return {
                    "rates": {
                      "2018-05-28": {
                        "HKD": 7.84495,
                        "GBP": 0.751146
                      },
                      "2018-05-29": {
                        "HKD": 7.84575,
                        "GBP": 0.754477
                      },
                      "2018-05-30": {
                        "HKD": 7.84685,
                        "GBP": 0.752771
                      },
                      "2018-05-31": {
                        "HKD": 7.84625,
                        "GBP": 0.752503
                      },
                      "2018-06-01": {
                        "HKD": 7.84585,
                        "GBP": 0.748955
                      },
                      "2018-06-02": {
                        "HKD": 7.84575,
                        "GBP": 0.74912
                      },
                      "2018-06-03": {
                        "HKD": 7.84555,
                        "GBP": 0.748868
                      },
                      "2018-06-04": {
                        "HKD": 7.84605,
                        "GBP": 0.750977
                      },
                      "2018-06-05": {
                        "HKD": 7.8474,
                        "GBP": 0.745875
                      },
                      "2018-06-06": {
                        "HKD": 7.84745,
                        "GBP": 0.745045
                      },
                      "2018-06-07": {
                        "HKD": 7.84635,
                        "GBP": 0.745381
                      },
                      "2018-06-08": {
                        "HKD": 7.847138,
                        "GBP": 0.746
                      },
                      "2018-06-09": {
                        "HKD": 7.845938,
                        "GBP": 0.74563
                      },
                      "2018-06-10": {
                        "HKD": 7.84635,
                        "GBP": 0.7455
                      },
                      "2018-06-11": {
                        "HKD": 7.846383,
                        "GBP": 0.747863
                      },
                      "2018-06-12": {
                        "HKD": 7.84695,
                        "GBP": 0.747719
                      },
                      "2018-06-13": {
                        "HKD": 7.8478,
                        "GBP": 0.747253
                      },
                      "2018-06-14": {
                        "HKD": 7.84995,
                        "GBP": 0.754432
                      },
                      "2018-06-15": {
                        "HKD": 7.848868,
                        "GBP": 0.752845
                      },
                      "2018-06-16": {
                        "HKD": 7.848868,
                        "GBP": 0.752845
                      },
                      "2018-06-17": {
                        "HKD": 7.84935,
                        "GBP": 0.753263
                      },
                      "2018-06-18": {
                        "HKD": 7.84955,
                        "GBP": 0.754264
                      },
                      "2018-06-19": {
                        "HKD": 7.84935,
                        "GBP": 0.759108
                      },
                      "2018-06-20": {
                        "HKD": 7.84569,
                        "GBP": 0.759137
                      },
                      "2018-06-21": {
                        "HKD": 7.84575,
                        "GBP": 0.755013
                      },
                      "2018-06-22": {
                        "HKD": 7.84785,
                        "GBP": 0.75391
                      },
                      "2018-06-23": {
                        "HKD": 7.84785,
                        "GBP": 0.75391
                      },
                      "2018-06-24": {
                        "HKD": 7.846541,
                        "GBP": 0.754053
                      },
                      "2018-06-25": {
                        "HKD": 7.8467,
                        "GBP": 0.753137
                      },
                      "2018-06-26": {
                        "HKD": 7.849,
                        "GBP": 0.756395
                      },
                      "2018-06-27": {
                        "HKD": 7.848265,
                        "GBP": 0.762207
                      }
                    },
                    "base": "USD"
                  }
            }
        }
      });
    });

    return p;
});

function createNodeMock(element) {
  if (element.type === 'input') {
    // This is your fake DOM node for <p>.
    // Feel free to add any stub methods, e.g. focus() or any
    // other methods necessary to prevent crashes in your components.
    return {};
  }
  // You can return any object from this method for any type of DOM component.
  // React will use it as a ref instead of a DOM node when snapshot testing.
  return null;
}

test('App.js', () => {
  const options = {createNodeMock}
  const component = renderer.create(
    <App />, options
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});