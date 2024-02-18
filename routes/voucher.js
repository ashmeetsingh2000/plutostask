const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Vou = require('../models/vouchermodel');
const User = require('../models/usermodel');
const Offer = require('../models/offermodel');

const checkToken = require('../middleware/checktoken');

// create new vouchers
router.post('/newvoucher', async (req, res) => {
    try {
        const { offer_id, voucherArr } = req.body;

        // Check if user already exists
        let voucher = await Vou.findOne({ offer_id });

        if (voucher) {
            return res.status(400).json({ message: 'Offer voucher already exists' });
        }

        // Create new user
        voucher = new Vou({ offer_id, voucherArr });

        // Save user to database
        await voucher.save();

        res.status(201).json({ message: 'Offer Vouchers added successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// create new vouchers

// get all vouchers
router.get('/voucherlist', checkToken, async (req, res) => {
    try {
        const vouchers = await Vou.find();
        res.json(vouchers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
// get all vouchers

// get all vouchers by offer id
router.get('/voucherList/:id', checkToken, async (req, res) => {
    try {
        const vouId = req.params.id;

        Vou.find({ offer_id: vouId })
            .then(results => {
                res.json(results);
            })
            .catch(error => {
                return res.status(400).json({ message: 'Invalid offer ID' });
            });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// get all vouchers by offer id

// randomly assign a voucher
router.put('/usevoucher/:id', checkToken, async (req, res) => {
    try {

        const vouId = req.params.id;

        Vou.find({ offer_id: vouId })
            .then(results => {
                get_voucher(results[0]._id)
            })
            .catch(error => {
                return res.status(400).json({ message: 'invalid offer id' });
            });

        async function get_voucher(voucher_collection_id) {

            // Check if the provided ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(voucher_collection_id)) {
                return res.status(400).json({ message: 'voucher id not valid' });
            }

            // Find the data by ID
            let data = await Vou.findById(voucher_collection_id);

            if (!data) {
                return res.status(404).json({ message: 'Data not found' });
            }

            // Update the specific value in the JSON array
            if (data.voucherArr.length == 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            else {
                let voucher_D = data.voucherArr[0];
                if (voucher_D.vouncher_usage_limit > 1) {
                    voucher_D.vouncher_usage_limit = voucher_D.vouncher_usage_limit - 1
                }
                else {
                    if (data.voucherArr.length == 1) { data.voucherArr = [] }
                    else {
                        data.voucherArr.shift();
                    }
                }

                await data.save();

                // add consumed voucher details in uesr list
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, 'jwtPlutosSecret');
                let user_details = await User.findById(decoded.user.id);

                let Offer_details = await Offer.findById(vouId);

                let jsonData = {}
                jsonData['offerTittle'] = Offer_details.tittle;
                jsonData['offerPrice'] = Offer_details.price;
                jsonData['voucherCode'] = voucher_D.vouncher_code;

                user_details.consumed_vouchers_list.push(JSON.stringify(jsonData))

                await user_details.save();
                // add consumed voucher details in uesr list

                res.json({ message: "this voucher hav been used", voucher_Code: `${voucher_D.vouncher_code}` });

            }

        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// randomly assign a voucher

// delete one voucher
router.delete('/deletevoucher/:id', async (req, res) => {
    try {

        const vouId = req.params.id;

        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(vouId)) {
            return res.status(400).json({ message: 'Invalid Voucher ID' });
        }

        // Find user by ID and delete
        const deletedvoucher = await Vou.findByIdAndDelete(vouId);

        // Check if the user exists
        if (!deletedvoucher) {
            return res.status(404).json({ message: 'voucher not found' });
        }

        res.json({ message: 'voucher deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// delete one voucher


module.exports = router;