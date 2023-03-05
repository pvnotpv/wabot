const { Buttons } = require('whatsapp-web.js');

const execute = async (client, msg, args) => {
    let button = new Buttons("Make sure to use a *'$'* as prefix before commands.\n\n*ECONOMY*\n1. *bal* -> wallet balance\n2. *beg* -> beg\n3. *gamble* -> Gamble\n4. *rob* -> rob someone \n5. *gib* -> give money \n6. *dep* -> Deposit\n7. *with* -> withdraw\n\n *MEMEY* \n1. *memes* -> trending memes atm. \n2. *animemes* -> random anime memes. \n3. *mlmemes* -> marvel Memes \n\n*FUN* \n1. *cwh* -> curse word history \n2. *insult* -> insult someone \n3. *howgay* -> check gay % \n4. *ppsize* -> check ppsize \n5. *yomamma* -> mom jokes(cringe free) \n\n*MISC*\n1. *sticker* -> pic/video/gif to sticker. \n2. *@everyone* -> ping everyone \n3. *disable/enable* -> disable/enable commands. \n4. *delete* -> delete a message(bot)\n5. *dlmsgs* -> View deleted messages. \n6. *about* -> About\n\n- Page: *1/3*\n- Usage:- *'$help no:'* to switch pages.",[{body:'$help 2'},{body:'$help 3'}],'HELP MENU :-)','Page 1/3');
    await client.sendMessage(msg.from, button)
}

module.exports = {execute};