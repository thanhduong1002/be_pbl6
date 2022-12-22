const moogoose = require('mongoose');
const validator = require('validator');

const Products = moogoose.model('Products', {
    name : {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    star:{
        type: Number
    },
    sold:{
        type:Number
    },
    linkImg:{
        type: String,
        required: true
    }
})

module.exports = Products
