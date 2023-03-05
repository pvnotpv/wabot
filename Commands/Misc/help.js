const Group = require('../../dbModels/groups')

const execute = async (client, msg, args) => {
    if(!args.length) {
        await msg.reply("*HELP MENU* :-)\n- Make sure to use a *'$'* as prefix before commands.\n\n*ECONOMY*\n1. *bal* -> wallet balance\n2. *beg* -> beg\n3. *gamble* -> Gamble\n4. *rob* -> rob someone \n5. *gib* -> give money \n6. *dep* -> Deposit\n7. *with* -> withdraw\n\n *MEMEY* \n1. *memes* -> trending memes atm. \n2. *animemes* -> random anime memes. \n3. *mlmemes* -> marvel Memes \n\n*FUN* \n1. *cwh* -> curse word history \n2. *insult* -> insult someone \n3. *howgay* -> check gay % \n4. *ppsize* -> check ppsize \n5. *yomamma* -> mom jokes \n\n*MISC*\n1. *sticker* -> pic/video/gif to sticker. \n2. *@everyone* -> ping everyone \n3. *disable/enable* -> disable/enable commands. \n4. *delete* -> delete a message(bot)\n5. *dlmsgs* -> View deleted messages. \n6. *about* -> About\n\n- Page: *1/3*\n- Usage:- *'$help no:'* to switch pages.")        
        return
    }

    var hasNumber = /\d/;   
    if(!hasNumber.test(args[0])) {
      await msg.reply('Usage: *$help* or *$help 2/3*')
      return;
    }

    if(args == 2) {
        await msg.reply('*ANIMALS* \n1. *cats* -> cute pussy pics \n2. *dogs* -> random doggo pics \n\n*IMAGE COMMANDS ($imghelp)* \n1. *imgdlt* -> Delete \n2. *imgshit* -> Shit \n3. *imgslap* -> Sins Slap \n4. *imghitler* -> Worse than hitler \n5. *imgtrash* -> Trash \n\njust send a pic and quote one of these\n*MORE COMING SOON!* \n\n*MEME COMMANDS ($mhelp)* \n1. *mworth* -> This is worthless! \n2. *mdrake* -> Drake meme \n3. *mgru* -> Gru meme \n4. *mdisbf* -> Bf meme temp \n5. *mdisgirl* -> Dis girl meme \n\n- Page: *2/3*')
        return;
    }

    if(args == 3) {
        const groupId = msg.from
        const group = await Group.findOne({groupId}) // don't use msg.from directly
        const nsfw = group.nsfw
        if(nsfw) {
            await msg.reply('*FUN*\n1. *senddick* -> send dick pics to someone \n2. *sendbooba* -> send tiddies to someone. \n\n*BODY*\n1. *boobs* -> fresh tiddies \n2. *pussy* -> pussies \n3. *cum* -> cumsluts \n4. *ass* -> ass\n\n*OTHER* \n1. *lesbian* -> lesbians \n2. *milfs* -> mhm milfs \n3. *kimono* -> waifus \n4. *egirl* -> egurls \n5. *asian* -> asians\n\n*FANTASY* \n1. *hentai* -> hentai \n2. *r34* -> if you know, you know\n\n- Page:- *3/3*')
        } else {
            await msg.reply('!! THIS PAGE CONTAINS NSFW STUFFS !!, enter *$enable nsfw* to use them.')
        }
    }

}

module.exports = {execute};