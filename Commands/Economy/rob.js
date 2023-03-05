const User = require("../../Models/robs")

const execute = async (client, msg, args) => {

    var numCheck = /\d/;
    if(!args.length || args[0].indexOf('@') || !numCheck.test(args[0])) {
        msg.reply('Usage: *$rob @user*')
        return;
    }

    const userid = String(msg.author.split('@')[0])
    const userRob = String(args[0].replace(/\D/g,''));

    if(msg.author === userRob || userRob === '17097070645') {
        await msg.reply('oh really?')
        return;
    }
    
    function toCurr(num) {
        const val = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return val
    }

    const num = Math.floor(Math.random() * 8) + 1;
    const rob = await User.rob(userid, userRob, 9, 0)

    switch(rob[0]) {
        case 2:
            const time = 120 - rob[1]
            await msg.reply(`Woah slow down there m8, Try again in *${time}s*`)
            return;
        case 3:
            await msg.reply('Atleast *¤ 100* required to rob someone.')
            return;
        case 4:
            await msg.reply("Uh oh, I can't find that user.")
            return;
        case 5:
            await msg.reply("The user dosen't have a minimum of *¤ 100*, not worth it m8.")
            return;
    }

    switch(num) {
        case 1:
            var amt = await User.rob(userid, userRob, 1.5, 'add')
            await msg.reply(`You managed to steal a grand total of *¤ ${toCurr(amt)}* !`)
            break

        case 2:
            var amt = await User.rob(userid, userRob, 2, 'add')
            await msg.reply(`You stole around *¤ ${toCurr(amt)}* !`)
            break

        case 3:
            var amt = await User.rob(userid, userRob, 2.5, 'add')
            await msg.reply(`You stole a tiny portion, *¤ ${toCurr(amt)}* added to your wallet.`)
            break

        case 4:
            await User.rob(userid, userRob, 1, 'nan')
            await msg.reply('You got... nothing , was it worth it ?')
            break

        case 5:
            var amt = await User.rob(userid, userRob, 1.5, 'sub')
            await msg.reply(`Oops, you were caught stealing, you paid *¤ ${toCurr(amt)}*.`)
            break
        
        case 6:
            var amt = await User.rob(userid, userRob, 2, 'sub')
            await msg.reply(`Oops, you were caught stealing, you paid *¤ ${toCurr(amt)}*.`)
            break
        
        case 7:
            var amt = await User.rob(userid, userRob, 2.5, 'sub')
            await msg.reply(`Oops, you were caught stealing, you paid *¤ ${toCurr(amt)}*.`)
            break

        case 8:
            await User.rob(userid, userRob, 1, 'nan')
            await msg.reply(`You didn't win nor lose anything.`)
            break
    }


}

module.exports = {execute};