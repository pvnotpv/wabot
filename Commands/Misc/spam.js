//const getCooldown = require('../../DatabaseStuffs/DataBaseFunctions/getCooldown')
const {MessageMedia} = require('whatsapp-web.js');

const execute = async (client,msg,args) => {
    await msg.reply('command no more.')
    return;
    userid = String(msg.author.split('@')[0])

    let count = Number(args.shift());
    if (isNaN(count)) {
        await client.sendMessage(msg.from, "Eg:- *$spam 10 just fuck off* \n\n(quick fact: you can literally spam anything except pdfs. ;)");
        return
    }
    if (count > 20) {
        await client.sendMessage(msg.from, "*MAX IS 20*")
        return;
    }
    
    if(count <= 0) {
        await client.sendMessage(msg.from, "Eg:- *$spam 10 just fuck off* \n\n(quick fact: you can literally spam anything except pdfs. ;)");
        return;
    }
    
    if (msg.hasQuotedMsg) {
        let quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            let media = await quotedMsg.downloadMedia();
            if (media.mimetype === 'application/pdf') {
                msg.reply('anything except pdfs')
            }
            let sticker = false;
            if (quotedMsg.type == "sticker") {
                sticker = true;
                getCooldown(userid,'spam')
                .then(
                  (result) => {
                      if(result[0] == 0) {
                        time = 120 - result[1]
                        msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
                        return;
                      }
                      for (let i = 0; i < count; i++)
                      client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, media.filename), { sendMediaAsSticker: sticker });
                  })
            }            
            
        } else {
            getCooldown(userid,'spam')
                .then(
                  (result) => {
                      if(result[0] == 0) {
                        time = 120 - result[1]
                        msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
                        return;
                      }
                      for (let i = 0; i < count; i++)
                      client.sendMessage(msg.from, quotedMsg.body);
                    })
        }
    }
    else {
        if (args.length) {
            getCooldown(userid,'spam')
                .then(
                  (result) => {
                      if(result[0] == 0) {
                        time = 120 - result[1]
                        msg.reply(`Woah slow down there kiddo, try again in *${time}s*`)
                        return;
                      }
                      let text = args.join(' ');
                      for (let i = 0; i < count; i++)
                      client.sendMessage(msg.from, text);
                    })
            
        } else {
            client.sendMessage(msg.from, "bruh, here's an example:  *$spam 10 just fuck off*");
        }
        
    }
};

module.exports = {execute};