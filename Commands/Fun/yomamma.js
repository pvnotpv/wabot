const User = require("../../Models/cooldowns")
const fetch = require('node-fetch');
let url = "https://api.yomomma.info/";
let settings = { method: "Get" };
require('dotenv').config()

const execute = async (client, msg, args) => {
    
    const userid = String(msg.author.split('@')[0])
    const mentions = await msg.getMentions();
    const chat = await msg.getChat();

    const cooldown = await User.getCd(userid, 'momma', 1)
    const timeMS = Date.now() - cooldown
    const inSec = Math.floor(timeMS / 1000)

    if(cooldown != 0 && inSec < 12) {
        const time = 12 - inSec
        await msg.reply(`Woah slow down there kid, try again in *${time}s*`)
        return
    }

    if(Object.keys(mentions).length === 0) {
        msg.reply('you need to mention someone mate, *$yomamma @user*');
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
            joke = json['joke']
            for(let contact of mentions) {
                chat.sendMessage(`@${contact.id.user} ${joke}`, {
                    mentions: [contact]
                });
            };
        });
        
    } catch (error) {
        await msg.reply('please try again.')
        return;
    }

    await User.getCd(userid, 'momma', 0)

};


module.exports = {execute};
