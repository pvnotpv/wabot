//REWRITE, MONGOOSE 7 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

mongoose.connect(process.env.dburl);

const userdata = new Schema({

    userid: {
        type: Number,
        required: true
    },
    
    balance: {
        walletBal: 0,
        bankBal: 0,
        bankMax: 0
    },

    daily: {
        daily: 0,
        streak: 0
    },

    curseCheck: {
        stats: false,
        firstUsed: String
    },

    curseWords: {
        fuck: 0,
        shit: 0,
        cunt: 0,
        pussy: 0,
        cock: 0,
        dick: 0,
        ass: 0,
        penis: 0,
        hell: 0,
        asshole: 0,
        nigga: 0,
        nigger: 0,
        myre: 0,
        faggot: 0,
        dickhead: 0,
        vagina: 0,
        ayn: 0,
        gay: 0,
        piss: 0,
        motherfucker: 0,
        fucked: 0
    },

    sticker: {
        name: String,
        authorname: String
    },

    picperms: {
        dickpics: Boolean,
        boobpics: Boolean
    }

});

const users = mongoose.model('users', userdata);

module.exports = users;

// db.users.updateMany({ }, [ {$set : {balance: {'bank': 0 }}}])
// updateMany({}, {$set:{"someField": "someValue"}})