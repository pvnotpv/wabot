const users = require('../../dbModels/users')
const rClient = require('../../redis')

const execute = async (client, msg) => {
    const utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    const userid = String(msg.author.split('@')[0])

    const pUser = await rClient.get(userid)
    const user = JSON.parse(pUser)
    const cooldown = user.cooldowns['cwh']

    const data = await users.findOne({userid})
    const stat = data.curseCheck['stats']

    if(!stat) {
        await msg.reply(`Done. From today *(${utc})* onwards , The bot'll keep track of all your swear/curse/bad word usage. Use *$cwh* again to check your stats.`)
        data.curseCheck['stats'] = true
        data.curseCheck['firstUsed'] = utc
        await data.save()
        return;
    }
    
    const timeMS = Date.now() - cooldown
    const inSec = Math.floor(timeMS / 1000)

    if(cooldown != 0 && inSec < 20) {
        const time = 20 - inSec
        await msg.reply(`Woah slow down there man, try again in *${time}s*`)
        return
    }

    var firstUsed = data.curseCheck['firstUsed']
    var fuck = data.curseWords['fuck']
    var shit = data.curseWords['shit']
    var cunt = data.curseWords['cunt']
    var pussy = data.curseWords['pussy']
    var cock = data.curseWords['cock']
    var dick = data.curseWords['dick']
    var ass = data.curseWords['ass']
    var penis = data.curseWords['penis']
    var hell = data.curseWords['hell']
    var asshole = data.curseWords['asshole']
    var nigga = data.curseWords['nigga']
    var nigger = data.curseWords['nigger']
    var myre = data.curseWords['myre']
    var faggot = data.curseWords['faggot']
    var dickhead = data.curseWords['dickhead']
    var vagina = data.curseWords['vagina']
    var ayn = data.curseWords['ayn']
    var gay = data.curseWords['gay']
    var piss = data.curseWords['piss']
    var motherfucker = data.curseWords['motherfucker']
    var fucked = data.curseWords['fucked']
    
    await msg.reply(`Your dirty language usage from *${firstUsed}* \n\nNo. **** Word: Usage  \n\n1. *fuck*: *${fuck}*\n2. *shit*: *${shit}*\n3. *cunt*: *${cunt}* \n4. *pussy*: *${pussy}* \n5. *cock*: *${cock}* \n6. *dick*: *${dick}* \n7. *ass* : *${ass}*\n8. *penis*: *${penis}* \n9. *hell*: *${hell}* \n10. *asshole*: *${asshole}* \n11. *nigga*: *${nigga}* \n12. *nigger*: *${nigger}* \n13. *myre*: *${myre}* \n14. *faggot*: *${faggot}*\n15. *dickhead*: *${dickhead}* \n16. *vagina*: *${vagina}* \n17. *ayn*: *${ayn}* \n18. *gay*: *${gay}* \n19. *piss*: *${piss}*\n20. *motherfucker*: *${motherfucker}* \n21. *fucked*: *${fucked}*\n\n Hmmm... seems like a you're a good guy :)\n\nThese values'll increment everytime when you use one of these.`)
    user.cooldowns['cwh'] = Date.now()
    await rClient.set(userid, JSON.stringify(user))

}

module.exports = {execute};