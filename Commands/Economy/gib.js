const User = require("../../Models/gibs")

const execute = async (client, msg, args) => {

    var hasNumber = /\d/;   
    if(!args.length || args[0] == null || args[1] == null || args[0].indexOf('@') || !hasNumber.test(args[0]) || !hasNumber.test(args[1])) {
        msg.reply('Usage: *$gib @user amount*')
        return;
    }

    const userid = String(msg.author.split('@')[0])
    const userGib = Number(args[0].replace(/\D/g,''));
    const amount = Number(args[1].replace(/\D/g,''));


    if(typeof(amount) != 'number') {
        await msg.reply('Usage: *$gib @user amount*')
        return
    }

    const give = await User.give(userid, userGib, amount)
    if(!give) {
        await msg.reply("Uh oh, I can't find that user.")
        return;
    }

    switch(give[0]) {
        case 0:
            const time = 60 - give[1]
            await msg.reply(`Woah slow down there mate, Try again in *${time}s*`)

        case 1:
            await msg.reply(`You don't have that much man, Wallet Balance: *¤ ${give[1]}*`)
            return;

        case 2:
            const bal = give[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            await msg.reply(`Done, You now have *¤ ${bal}*`)
            return;

    }

}

module.exports = {execute};