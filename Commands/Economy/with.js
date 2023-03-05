const User = require("../../Models/user")

const execute = async (client, msg, args) => {

    const userid = String(msg.author.split('@')[0])

    var hasNumber = /\d/;   
    if(!args.length || !hasNumber.test(args[0])) {
        msg.reply('Usage: *$with amount*')
        return;
    }

    const amount = Number(args[0].replace(/\D/g,''));
    const withdraw = await User.withdraw(userid, amount)

    switch(withdraw[0]) {
        case 0:
            const time = 25 - withdraw[1]
            await msg.reply(`Woah slow down there mate, try again in *${time}s*`)
            return;

        case 1:
            await msg.reply("Not enough bank balance.")
            return;

        case 2:
            await msg.reply(`Done, *¤ ${amount}* withdrawn.*`)
            return;
        
    }

}

module.exports = {execute};