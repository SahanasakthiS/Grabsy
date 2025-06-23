const paypal= require('paypal-rest-sdk');


paypal.configure({
    mode: 'sandbox',
    client_id: 'AWrALGjb-rWLwTCISMSf0aPzhYyosVLLKfx4rObjumiDHANrsJB4zoKdnA4t57m4yDyMRw_II08OdZjE',
    client_secret: 'EIp56LnKgp26NVmXM6wa5OXWgmrauET9Yy3vvL5ZYD4FSgJ8Q6vvWY298RqrnWMjrEBI4A4Fk2Vd-aOH'
});

module.exports = paypal;