const Group = require('../../dbModels/groups')
const users = require('../../dbModels/users')
const rClient = require('../../redis')

const execute = async (client, msg, args) => {
    const userid = String(msg.author.split('@')[0])
    const user = await users.findOne({userid})

    const rUser = await rClient.get(userid)
    const User = JSON.parse(rUser)
    
    if(args[0] == 'senddick') {

        if(!user.picperms.dickpics) {
            await msg.reply('you already have it disabled, use the *$enable* command to enable it.')
            return;
        }

        user.dickpics = false
        User.dickpics = false
        await rClient.set(userid, JSON.stringify(User))
        await user.save()
        await msg.reply("Done, you'll no longer receive dick pics.")
        return;
    }

    if(args[0] == 'sendbooba') {

        if(!user.picperms.boobpics) {
            await msg.reply('you already have it disabled, Use the *$enable* command to enable it.')
            return;
        }

        user.boobpics = false
        User.boobpics = false
        await rClient.set(userid, JSON.stringify(User))
        await user.save()
        await msg.reply("Done, you'll no longer receive boob pics.")
        return;
    }

    let chat = await msg.getChat();
    let admins = chat.participants.find(admin => admin.id._serialized == msg.author)

    if (!admins.isAdmin) {
        await msg.reply('ADMIN PERMS REQUIRED')
        return;
    }

    const groupId = msg.from
    const group = await Group.findOne({groupId}) // dont use msg.from directly

    const gr = await rClient.get(msg.from)
    const groupStat = JSON.parse(gr)

    if(args[0] === 'dlmsgs') {
        
        groupStat.dlstat = false
        group.dlstat = false
        group.save()
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await msg.reply('Done.')
        return;
    }
    
    if(args[0] === 'nsfw') {
        if(!group.nsfw) {
            await msg.reply('NSFW COMMANDS ARE DISABLED HERE, enter *$enable nsfw* to enable them.')
            return;
        }
        group.nsfw = false
        groupStat.nsfw = false
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await group.save()
        await msg.reply('Done, NSFW COMMANDS DISABLED. You can enable them anytime using the *$enable* command.')
        return;
    }

    if(args[0] === 'everyone') {
        if(!group.everyone) {
            await msg.reply('*$everyone* is disabled here.')
            return
        }
        groupStat.everyone = false
        group.everyone = false
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await group.save()
        await msg.reply('Done.')
        return;
    }

    

    await msg.reply('Expected arguments:- *$disable nsfw/everyone/senddick/sendbooba/dlmsgs*')

        
        
}
module.exports = {execute};

              