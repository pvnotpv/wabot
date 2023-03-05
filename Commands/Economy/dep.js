const User = require("../../Models/user")

const execute = async (client,msg,args) => {
 
    const userid = String(msg.author.split('@')[0])

    var hasNumber = /\d/;   
    if(!args.length || !hasNumber.test(args[0])) {
        await msg.reply('Usage: *$dep amount*')
        return;
    }

    const amount = Number(args[0].replace(/\D/g,''));
    if(amount < 100) {
        await msg.reply('Minimum deposit amount is *¤ 100*.')
        return;
    }

    const dep = await User.depost(userid, amount)

    switch(dep[0]) {
        case 0:
            const time = 25 - dep[1]
            await msg.reply(`Woah slow down there mate, try again in *${time}s*`)
            return;

        case 1:
            await msg.reply('Not enough wallet balance.')
            return;

        case 2:
            await msg.reply(`You can deposit a maximum of *¤ ${dep[1]}* right now, buy bankslips to deposit more.`)
            return;
        
        case 3:
            await msg.reply(`Done, deposited *¤ ${amount}*.`)
            return;
    }

}

module.exports = {execute};