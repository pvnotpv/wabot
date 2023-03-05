const User = require("../../Models/cooldowns")
require('dotenv').config()

const execute = async (client, msg, args) => {

    const userid = String(msg.author.split('@')[0])
    const num = Math.floor(Math.random() * 100) + 1;

    const mentions = await msg.getMentions();
    const chat = await msg.getChat();
    
    if(Object.keys(mentions).length === 0) {
        await msg.reply('you need to mention someone mate, *$howgay @user*');
    }
    
    for(let contact of mentions) {
        if (contact.id.user == Number(process.env.botno)) {
            msg.reply('oh really ?')
            return
        };
    };

    const cooldown = await User.getCd(userid, 'howgay', 1)
    const timeMS = Date.now() - cooldown
    const inSec = Math.floor(timeMS / 1000)
    
    if(cooldown != 0 && inSec < 12) {
        const time = 12 - inSec
        await msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
        return
    }

    for(let contact of mentions) {
        chat.sendMessage(`@${contact.id.user} is ${num}% gay 🏳‍🌈`, {
            mentions: [contact]
        });
    };

    await User.getCd(userid, 'howgay', 0)

}

module.exports = {execute};