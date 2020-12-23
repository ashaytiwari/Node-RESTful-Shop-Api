const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST request'
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === '200'){
        res.status(200).json({
            message: 'You discovered new id',
            productid: id
        });
    }
    else{
        res.status(200).json({
            message: 'You passed another id',
            productid: id
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
   res.status(200).json({
       message: 'Product UPDATED!',
       productid: id
   })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
   res.status(200).json({
       message: 'Product DELETED!',
       productid: id
   })
});

module.exports = router;