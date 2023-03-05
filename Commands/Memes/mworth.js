const { MessageMedia } = require('whatsapp-web.js');
const User = require("../../Models/cooldowns")
const jimp = require(`jimp`);

const execute = async (client,msg,args) => {
  const userid = String(msg.author.split('@')[0])
  const cd = await User.getMcd(userid, 'mworth', 1)

  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)
    
  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }

  if(!args.length) {
    await msg.reply('Usage:- *$mworth text*')
    return;
  }
  
  let text = args.join(' ');
  const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
  const image = await jimp.read('Assets/MemeTemplates/worthless.jpg');

  try {
    image.print(font,310,280,text,800);
  
    image.getBuffer(`image/png`, async (err, buffer) => {
        const base64File = buffer.toString('base64')
        const media = new MessageMedia('image/png',base64File , 'meme');
        await msg.reply(media)
        await User.getMcd(userid, 'mworth', 0)
    });;
    
  } catch (error) {
    await msg.reply('Usage:- *$mworth text*')
  }
  
};


module.exports = {execute};