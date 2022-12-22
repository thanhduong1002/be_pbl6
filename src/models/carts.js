const moogoose = require('mongoose');
const validator = require('validator');

const Carts = moogoose.model('Carts', {
    iduser:{
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size:{
        type: String,
        required: true
    },
    linkImg:{
        type: String,
        required: true
    },
    sum : {
        type: Number,
    },
})

module.exports = Carts
