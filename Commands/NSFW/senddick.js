const { MessageMedia } = require('whatsapp-web.js');
const nsfw = require('./nsfwMain.js')
const users = require('../../dbModels/users')
const Group = require('../../dbModels/groups')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client, msg, args) => {
    
    const numCheck = /\d/;
    if(!args.length || args[0].indexOf('@') || !numCheck.test(args[0])) {
        msg.reply('Usage: *$senddick @user*')
        return;
    }
    
    const auser = String(msg.author.split('@')[0])
    const userid = String(args[0].replace(/\D/g,''));
    const user = userid + '@c.us'

    const usercheck = await users.findOne({userid})

    if(!usercheck) {
        await msg.reply("Uh oh, I can't find that user.")
        return;
    }

    if(!usercheck.picperms.dickpics) {
       await msg.reply('Uh oh , the user has disabled *$senddick*.')
       return;
    }

    const groupId = msg.from
    const group = await Group.findOne({groupId}) // don't use msg.from directly
    const nsfwstat = group.nsfw

    if(!nsfwstat) {
        await msg.reply('!!! NSFW COMMANDS ARE DISABLED HERE, ENTER *$enable nsfw* to use them. !!!')
        return;
    }

    const value = await rClient.get('dick')
    const obj = JSON.parse(value);
    const reobj = eval(obj)
    const name = reobj[Math.floor(Math.random()*reobj.length)];

    const url = name['link']

    async function dick() {
        try {
          const media = await MessageMedia.fromUrl(url)
          await client.sendMessage(user, media, {caption: `@${auser} sent you a dick pic!`})
          await msg.reply(`Done, dick pic sent to @${userid}`)
          return;
          
        } catch (error) {
          await msg.reply('please try again.')
          
        }
    }

    const cd = await User.getNsfwCd(auser, 'senddicks', 1)
    const timeMS = Date.now() - cd
    const inSec = Math.floor(timeMS / 1000)

    if(cd != 0 && inSec < 30) {
        const time = 30 - inSec
        await msg.reply(`Woah slow down there young man, try again in *${time}s*.`)
        return;
    }

    try {
        await dick()
        await User.getNsfwCd(auser, 'senddicks', 0)
        await nsfw("MassiveCock+penis","dick")
    
    } catch (error) {
        await nsfw("MassiveCock+penis","dick")
    }


}

module.exports = {execute};