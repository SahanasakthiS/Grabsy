const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String
}, {timeStamps : true})

module.exports =mongoose.model('Address',AddressSchema)
