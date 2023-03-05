const User = require("../../Models/user")
const Bot = require('../../dbModels/bot')
const rClient = require('../../redis') 
const users = require('../../dbModels/users')

const execute = async (client, msg, args) => {
    const userid = String(msg.author.split('@')[0])

    if(args[0] === 'edit') {

        if(!args[1] || !args[2]) {
            await msg.reply('- Change the default sticker metadata. \n*Usage*:- $sticker edit name authorname\n*Eg*:- $sticker edit tits tiddies')
            return;
        }

        const mUser = await users.findOne({userid})
        const rUser = await rClient.get(userid)
        const user = JSON.parse(rUser)

        mUser.sticker.name = args[1]
        mUser.sticker.authorname = args[2]
        user.sticker.name = args[1]
        user.sticker.authorname = args[2]

        await rClient.set(userid, JSON.stringify(user))
        await mUser.save()
        await msg.reply('Done. Default metadata edited.')
        return;

    }
    const user = await User.sticker(userid, false)

    if(user[0] == 0) {
        const time = 10 - user[1]
        await msg.reply(`Woah slow down there man, try again in *${time}s*`)
        return;
    }
    
    const sName = user[0]
    const aName = user[1]

    async function makesticker(mediafile) {
        await msg.reply(mediaData, null, {
            sendMediaAsSticker: true,
            stickerName: sName,
            stickerAuthor: aName
        })

        await User.sticker(userid, true)
        const id = 69
        const bot = await Bot.findOne({id})
        bot.stcksmd += 1
        await bot.save()
        return;
    }

    if(msg.hasMedia) {
        var mediaData = await msg.downloadMedia()
        await makesticker(mediaData)
        return;
    }
    
    var quotedMsg = await msg.getQuotedMessage();
    if(!msg.hasQuotedMsg || !quotedMsg.hasMedia) {
        await msg.reply('- You can either send a pic/video/gif with *$sticker* as caption or quote(mention) one with *$sticker*.\n\n- To change the default metadata:- $sticker edit name authorname')
        return;
    }

    try {
        var mediaData = await quotedMsg.downloadMedia()
        await makesticker(mediaData)
        
    } catch (error) {
        await msg.reply('please resend the media and try again.')
        
    }
    
};



module.exports = {execute};
