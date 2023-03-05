const User = require("../../Models/cooldowns")
const Group = require("../../Models/group")
const groups = require('../../dbModels/groups');

const execute = async (client,msg) => {
    const userid = String(msg.author.split('@')[0])
    const chat = await msg.getChat();
    
    if (!chat.isGroup) {
        await client.sendMessage(msg.from, 'This command can only be used in a group.')
        return
    } 
    
    await User.checkUser(userid)
    await Group.getGroup(msg.from, chat.name)

    const groupId = msg.from
    const group = await groups.findOne({groupId})
    
    if(!group.everyone) {
        await msg.reply('*$everyone* is disabled here.')
        return;
    }
    
    let text = "";
    let mentions = [];
        
    for(let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
        text += `@${participant.id.user} `;
    }
    
    const cd = await User.getCd(userid, 'everyone', 1)
    const timeMS = Date.now() - cd
    const inSec = Math.floor(timeMS / 1000)
    
    if(cd != 0 && inSec < 120) {
        const time = 120 - inSec
        await msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
        return
    }
    
    await chat.sendMessage(text, { mentions });
    await User.getCd(userid, 'everyone', 0)
}

module.exports = {execute};