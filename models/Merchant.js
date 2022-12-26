const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    logoUrl:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    desc: {
        type:String,
        required: true
    },
    offerAmt:{
        type:Number,
    },
    offerType:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("Merchant",merchantSchema);