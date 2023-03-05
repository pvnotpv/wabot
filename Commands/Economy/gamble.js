const User = require("../../Models/user")

const execute = async (client, msg, args) => {

    const userid = String(msg.author.split('@')[0])

    var hasNumber = /\d/;   
    if(!args.length || !hasNumber.test(args[0])) {
      await msg.reply('You gotta bet smtn bro\nUsage: *$gamble amount*')
      return
    }
    
    const amount = Number(args[0].replace(/\D/g,''));

    if(amount < 100) {
        await msg.reply('Minimum gamble amount is *¤ 100*')
        return;
    }

    const num = Math.floor(Math.random() * 5) + 1;
    const gamble = await User.gamble(userid, amount, 5)

    if(gamble[0] == 2) {
        const time = 20 - gamble[1]
        await msg.reply(`Woah slow down there mate, Try again in *${time}s*`)
        return;
    }

    if(gamble[0] == 3) {
        await msg.reply('Check your wallet balance.')
        return;
    }

    if(num === 1 ) {
        await User.gamble(userid, amount, 0)
        await msg.reply("Better luck next time son, Every dog has a day.")

    } else if(num === 2) {
        await User.gamble(userid, amount, 0)
        await msg.reply("Maybe it's not your lucky day XD, you've lost your bet")
        
    } else if(num === 3) {
        await User.gamble(userid, amount, 2)
        await msg.reply("Looks like it's a draw, you didn't win nor lose anything.")

    } else if(num === 4) {
        await User.gamble(userid, amount*2, 1)
        await msg.reply("Damn bro, you've won twice your bet!")

    } else {
        await User.gamble(userid, amount*3, 1)
        await msg.reply("You lucky a-hole!!, you've won thrice your bet!")
    }

}

module.exports = {execute};