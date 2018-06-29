process.env.NODE_ENV = 'development';

const server = require('../server');
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let chaiHttp = require('chai-http');


chai.use(chaiHttp);

describe('All routes', () => {
    describe('Get View', () => {
        let counter = 0;
        const total = 3;
        it('All view-related files return 200', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    counter++;
                    if (counter >= total) {
                        done();
                    }
                });
                
            chai.request(server)
            .get('/bundle.js')
            .end((err, res) => {
                res.should.have.status(200);
                counter++;
                if (counter >= total) {
                    done();
                }
            });
            
            chai.request(server)
                .get('/css/App.css')
                .end((err, res) => {
                    res.should.have.status(200);
                    counter++;
                    if (counter >= total) {
                        done();
                    }
                });
        })
    })

    

    describe('/api/rates', () => {
        it('Get Current Rate', (done) => {
                chai.request(server)
                        .get('/api/rates')
                        .end((err, res) => {
                            res.should.have.status(200);
                            const rates = ['HKD', 'USD', 'GBP', 'EUR'];
                            for (let rate of rates) {
                                res.body.should.have.property('rates').that.has.property(rate);
                            }
                            res.body.should.have.property('base').eql('USD');

                            done();
                        });
            });
        });
    

    describe('/api/history?from=HKD&to=GBP', () => {
        it('Get HKD & GBP history', (done) => {
                chai.request(server)
                        .get('/api/history?from=HKD&to=GBP')
                        .end((err, res) => {
                            res.should.have.status(200);
                            
                            res.body.should.have.property('rates')
                            Object.keys(res.body.rates).should.have.length(30);
                            Object.keys(res.body.rates).forEach(function(key) {
                                res.body.rates.should.have.property(key);
                                res.body.rates[key].should.have.property('HKD')
                                    .that.to.be.a('number');
                                res.body.rates[key].should.have.property('GBP')
                                    .that.to.be.a('number');
                            });

                            res.body.should.have.property('base').eql('USD');

                            done();
                        });
            });
        });

        

    describe('/api/history?from=EUR&to=GBP', () => {
        it('Get EUR & GBP history', (done) => {
                chai.request(server)
                        .get('/api/history?from=EUR&to=GBP')
                        .end((err, res) => {
                            res.should.have.status(200);
                            
                            res.body.should.have.property('rates')
                            Object.keys(res.body.rates).should.have.length(30);
                            Object.keys(res.body.rates).forEach(function(key) {
                                res.body.rates.should.have.property(key);
                                res.body.rates[key].should.have.property('EUR')
                                    .that.to.be.a('number');
                                res.body.rates[key].should.have.property('GBP')
                                    .that.to.be.a('number');
                            });

                            res.body.should.have.property('base').eql('USD');

                            done();
                        });
            });
        });

    
        describe('/api/history', () => {
            it('Get history without currency', (done) => {
                    chai.request(server)
                            .get('/api/history')
                            .end((err, res) => {
                                res.should.have.status(400);
                                
                                res.body.should.have.property('error')
                                    .that.eql("currency not specified");
    
                                done();
                            });
                });
            });

    
        describe('/api/history?from=HKD', () => {
            it('Get history without all currencies', (done) => {
                    chai.request(server)
                            .get('/api/history?from=HKD')
                            .end((err, res) => {
                                res.should.have.status(400);
                                
                                res.body.should.have.property('error')
                                    .that.eql("currency not specified");
    
                                done();
                            });
                });
            });
    
        describe('/api/history?to=HKD', () => {
            it('Get history without all currencies', (done) => {
                    chai.request(server)
                            .get('/api/history?to=HKD')
                            .end((err, res) => {
                                res.should.have.status(400);
                                
                                res.body.should.have.property('error')
                                    .that.eql("currency not specified");
    
                                done();
                            });
                });
            });

        describe('/api/history?from=HKD&to=JPY', () => {
            it('Get history with unavailable currency', (done) => {
                    chai.request(server)
                            .get('/api/history?from=HKD&to=JPY')
                            .end((err, res) => {
                                res.should.have.status(404);
                                
                                res.body.should.have.property('error')
                                    .that.eql("currency not available");
    
                                done();
                            });
                });
            });

            

        describe('/api/abc', () => {
            it('Get non-exist route', (done) => {
                    chai.request(server)
                            .get('/api/abc')
                            .end((err, res) => {
                                res.should.have.status(404);
                                
                                res.body.should.have.property('error')
                                    .that.eql("route not found");
    
                                done();
                            });
                });
            });

        describe('/abc', () => {
            it('Get non-exist route', (done) => {
                    chai.request(server)
                            .get('/abc')
                            .end((err, res) => {
                                res.should.have.status(404);
                                
                                res.body.should.have.property('error')
                                    .that.eql("route not found");
    
                                done();
                            });
                });
            });

    
    after((done) => {
        server.close();
        done();
    })
})

