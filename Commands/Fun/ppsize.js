const User = require("../../Models/cooldowns")
require('dotenv').config()

const execute = async (client, msg, args) => {

    const userid = String(msg.author.split('@')[0])
    const num = Math.floor(Math.random() * 8) + 1;

    const mentions = await msg.getMentions();
    const chat = await msg.getChat();
    const cooldown = await User.getCd(userid, 'ppsize', 1)
    
    const timeMS = Date.now() - cooldown
    const inSec = Math.floor(timeMS / 1000)
    
    if(cooldown != 0 && inSec < 12) {
        const time = 12 - inSec
        await msg.reply(`Woah slow down there man, try again in *${time}s*`)
        return
    }
    
    if(Object.keys(mentions).length === 0) {
        await msg.reply('you need to mention someone mate, *$ppsize @user*');
        return;
    }
    
    for(let contact of mentions) {
        if (contact.id.user == Number(process.env.botno)) {
            msg.reply('8================D 😎')
            return
        };
    };

    await User.getCd(userid, 'ppsize', 0)

    const pp =  '=';
    const ppSize = pp.repeat(num)
    
    for(let contact of mentions) {
        chat.sendMessage(`8${ppSize}D , @${contact.id.user}'s pp size 🙂`, {
            mentions: [contact]
        });
    };
}

module.exports = {execute};