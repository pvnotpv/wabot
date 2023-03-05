const User = require("../../Models/user")

const execute = async (client,msg) => {
    await msg.reply('command broken , try again later.')
    return;

    const userid = String(msg.author.split('@')[0])
    const daily = await User.daily(userid) 
    
    if(daily[0] == 1) {
        await msg.reply(`Oops, you lost your *${daily[1]}* days streak :/ \n*¤ 1000* added to your wallet.`)
    } else if(daily[0] == 0) {
        await msg.reply("You've already colleced it, remember?")
    } else {
        await msg.reply(`*¤ ${daily[1]}* added to your wallet.\nCurrent streak: *${daily[2]}* days.`)
    }

}

module.exports = {execute};