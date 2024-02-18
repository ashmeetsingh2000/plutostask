const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    expiredate: {
        type: String,
        required: true
    }
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;