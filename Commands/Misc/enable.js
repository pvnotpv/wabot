const Group = require('../../dbModels/groups')
const users = require('../../dbModels/users')
const rClient = require('../../redis')

const execute = async (client, msg, args) => {
    const userid = String(msg.author.split('@')[0])
    const user = await users.findOne({userid})

    const rUser = await rClient.get(userid)
    const User = JSON.parse(rUser)

    if(args[0] == 'senddick') {
        if(user.dickpics) {
            await msg.reply('you already have it enabled, use the *$disable* command to disable it.')
            return;
        }

        user.dickpics = true
        User.dickpics = true
        await user.save()
        await rClient.set(userid, JSON.stringify(User))
        await msg.reply("Done")
        return;
    }

    if(args[0] == 'sendbooba') {
        if(user.boobpics) {
            await msg.reply('you already have it enabled, use the *$disable* command to disable it.')
            return;
        }

        user.boobpics = true
        User.boobpics = true
        await rClient.set(userid, JSON.stringify(User))
        await user.save()
        await msg.reply("Done")
        return;
    }

    let chat = await msg.getChat();
    let admins = chat.participants.find(admin => admin.id._serialized == msg.author)

    if (!admins.isAdmin) {
        await msg.reply('ADMIN PERMS REQUIRED')
        return;
    }

    const groupId = msg.from
    const group = await Group.findOne({groupId}) // don't use msg.from directly

    const gr = await rClient.get(msg.from)
    const groupStat = JSON.parse(gr)

    if(args[0] === 'dlmsgs') {
        const gr = await rClient.get(msg.from)
        const groupStat = JSON.parse(gr)
        groupStat.dlstat = true
        group.dlstat = true
        group.save()
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await msg.reply('Done.')
        return;
    } 
    
    if(args[0] === 'nsfw') {
        if(group.nsfw) {
            await msg.reply('NSFW COMMANDS ARE ENABLED HERE, enter *$disable nsfw* to disable them.')
            return;
        }
        group.nsfw = true
        groupStat.nsfw = true
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await group.save()
        await msg.reply('Done, NSFW COMMANDS ENABLED. You can disable them anytime using the *$disable* command.')
        return;
    }

    if(args[0] === 'everyone') {
        if(group.everyone) {
            await msg.reply('*$everyone* is enabled here. *Enter $disable everyone* to disable it.')
            return
        }
        group.everyone = true
        groupStat.everyone = true
        await rClient.set(msg.from, JSON.stringify(groupStat))
        await group.save()
        await msg.reply('Done.')
        return;
    }

    
    await msg.reply('Expected arguments:- *$enable nsfw/everyone/senddick/sendbooba/dlmsgs*')

        
        
}
module.exports = {execute};

              