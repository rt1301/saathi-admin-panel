const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offerAmt: {
        type: Number,
    },
    offerType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tag:[{
        type: String
    }],
    parameters:{
        type: Object
    },
    merchant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant",
    }]
})

module.exports = mongoose.model("Product", productSchema);