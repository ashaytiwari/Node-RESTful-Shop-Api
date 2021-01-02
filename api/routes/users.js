const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length > 0){
           return res.status(409).json({
               message: "User Exist"
           });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User created successfully",
                                data: result,
                                request: {
                                    type: "POST",
                                    url: `http://localhost:3000/user/signup/${result._id}`
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email})
    .then(result => {
        if(result.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, result[0].password, (err, doc) => {
            if(err){
                return res.status(401).json({
                message: 'Auth failed'
                });
            }
            if(doc){
                const token = jwt.sign({
                    email: result[0].email,
                    id: result[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successfull',
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth Failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted',
            data: result,
            request: {
                type: "DELETE",
                url: `http://localhost:3000/user/signup/${result._id}`
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
