const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

mongoose.connect(process.env.dburl);

const groupData = new Schema({

    name: {
        type: String,
        required: true
    },

    groupId: {
        type: String,
        required: true
    },

    nsfw: {
        type: Boolean,
        required: true
    },

    ban: {
        type: Boolean,
        required: true
    },

    everyone: {
        type: Boolean,
        required: true
    },

    dlstat: {
        type: Boolean,
        required: true
    },

    dlmsgs: {
        type: Array,
        default: []
    }
    

});

const groups = mongoose.model('groups', groupData);

module.exports = groups;
