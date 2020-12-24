const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Headers for handling cors error provided by Browser
app.use((req, res, next) => {
    res.header("Allow-Control-Allow-Origin", "*");
    res.header("Allow-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authoriztion");
    if(req.method === 'OPTIONS'){
        res.header("Allow-Control-Allow-Methods", "PUT, PATCH, DELETE, POST, GET");
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('NOT FOUND!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    });
});

module.exports = app;