const User = require("../../Models/cooldowns")
const fetch = require('node-fetch');
let url = "https://insult.mattbas.org/api/insult.json";
let settings = { method: "Get" };
require('dotenv').config()

const execute = async (client, msg, args) => {
    
    const userid = String(msg.author.split('@')[0])
    const mentions = await msg.getMentions();
    const chat = await msg.getChat();

    const cooldown = await User.getCd(userid, 'insult', 1)
    const timeMS = Date.now() - cooldown
    const inSec = Math.floor(timeMS / 1000)

    if(cooldown != 0 && inSec < 12) {
        const time = 12 - inSec
        await msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
        return
    }

    if(Object.keys(mentions).length === 0) {
        msg.reply('you need to mention someone mate, *$insult @user*');
        return;
    }

    for(let contact of mentions) {
        if (contact.id.user == Number(process.env.botno)) {
            msg.reply('oh really ?')
            return
        };
    };

    try {

        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            insult = json['insult']
            for(let contact of mentions) {
                chat.sendMessage(`@${contact.id.user} ${insult}`, {
                    mentions: [contact]
                });
            };
        });
        
    } catch (error) {
        await msg.reply('please try again.')
    }

    await User.getCd(userid, 'insult', 0)
};


module.exports = {execute};