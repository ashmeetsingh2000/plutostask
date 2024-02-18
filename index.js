const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offer');
const voucherRoutes = require('./routes/voucher');

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/user', authRoutes);
app.use('/offer', offerRoutes);
app.use('/voucher', voucherRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://plutosadmin:plutos_admin@cluster0.a7rzwoa.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('MongoDB connected');
        app.listen(5000, () => console.log(`Server http://localhost:5000`));
    })
    .catch(err => console.error(err));