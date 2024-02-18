const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Offer = require('../models/offermodel');

const checkToken = require('../middleware/checktoken');

// create new offer
router.post('/newoffer', async (req, res) => {
    try {
        const { tittle, price, expiredate } = req.body;

        // Check if user already exists
        let offer = await Offer.findOne({ tittle });

        if (offer) {
            return res.status(400).json({ message: 'Offer already exists' });
        }

        // Create new user
        offer = new Offer({ tittle, price, expiredate });

        // Save user to database
        await offer.save();

        res.status(201).json({ message: 'Offer created successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// create new offer

// get all offer
router.get('/offerlist', checkToken, async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
// get all offer

// delete offer
router.delete('/deleteoffer/:id', async (req, res) => {
    try {

        const offerId = req.params.id;

        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({ message: 'Invalid Offer ID' });
        }

        // Find user by ID and delete
        const deletedoffer = await Offer.findByIdAndDelete(offerId);

        // Check if the user exists
        if (!deletedoffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.json({ message: 'Offer deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// delete offer


module.exports = router;