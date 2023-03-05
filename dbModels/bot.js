const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

mongoose.connect(process.env.dburl);

const botdata = new Schema({

    id: {
        type: Number
    },

    commands: {
        type: Number
    },

    date: {
        type: String
    },

    stcksmd: {
        type: Number
    },

    tdcmds: {
        type: Number
    }

});

const bots = mongoose.model('bots', botdata);

module.exports = bots;
