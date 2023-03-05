const User = require("../../Models/user")

const execute = async (client, msg) => {

    const userid = String(msg.author.split('@')[0])
    const num = Math.floor(Math.random() * 100) + 1;
    const beg = await User.forBeg(userid, 696)
    
    if(beg[0] == 0) {
        const time = 35 - beg[1]
        await msg.reply(`Woah slow down there man, Try again in *${time}s.*`)
        return;
    }

    if(num < 10) {
        await User.forBeg(userid, 0)
        await msg.reply('Imagine begging XD')
        
    } else if(num > 10 && num < 20) {
        await User.forBeg(userid, 600)
        await msg.reply('here take *¤ 600*')

    } else if(num > 20 && num < 30) {
        await User.forBeg(userid, 0)
        await msg.reply('go ask yo mum')

    } else if(num > 30 && num < 40) {
        await User.forBeg(userid, 0)
        await msg.reply("I'm not a money tree or anything bro.")

    } else if (num > 45 && num < 55) {
        await User.forBeg(userid, 250)
        await msg.reply('here take *¤ 250*')

    } else if(num > 55 && num < 60) {
        await User.forBeg(userid, 0)
        await msg.reply('better luck next time son.')

    } else if (num > 65 && num < 80) {
        await User.forBeg(userid, 300)
        await msg.reply('here take *¤ 300*')
    
    } else if(num > 80 && num < 90) {
        await User.forBeg(userid, 0)
        await msg.reply('find a real job and earn smtn kid.')

    } else if (num > 92 && num < 100) {
        await User.forBeg(userid, 500)
        await msg.reply('here take *¤ 500*')
  
    } else {
        await User.forBeg(userid, 100)
        await msg.reply('here take *¤ 100* peasant.')
    }
}

module.exports = {execute};