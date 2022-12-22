const moogoose = require('mongoose');
const validator = require('validator');

const Supplies = moogoose.model('Supplies', {
    iduser:{
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    type : {
        type: String,
        required: true
    },
    count : {
        type: Number,
        required: true
    },
    unit:{
        type: String,
        required: true
    }
})

module.exports = Supplies
