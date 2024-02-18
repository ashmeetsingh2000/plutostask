const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    offer_id: {
        type: String,
        required: true,
    },
    voucherArr: [{
        vouncher_code: String,
        vouncher_usage_limit: String
    }]
});

const Vou = mongoose.model('Vou', voucherSchema);

module.exports = Vou;