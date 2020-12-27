const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product orderBy quantity _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                data: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        orderBy: doc.orderBy,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:300/orders/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500), json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: "Product not found for your order"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity,
                orderBy: req.body.orderBy
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order stored successfully',
                orderData: {
                    data: result,
                    request: {
                        type: "POST",
                        url: `http://localhost:300/orders/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('product orderBy quantity _id')
    .exec()
    .then(order => {
        if(order){
            res.status(200).json({
                data: order,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders/${order._id}`
                }
            });
        }
        else{
            res.status(404).json({
                message: "Order not found for given id"
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted successfully",
            data: result,
            request: {
                type: "DELETE",
                url: `http://localhost:3000/orders/${result._id}`
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;