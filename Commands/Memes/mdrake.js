const { MessageMedia } = require('whatsapp-web.js');
const User = require("../../Models/cooldowns")
const jimp = require(`jimp`);

const execute = async (client,msg,args) => {

  const userid = String(msg.author.split('@')[0])
  const cd = await User.getMcd(userid, 'mdrake', 1)

  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)
    
  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }

  if(!args.length || !args[1]) {
    await msg.reply('Usage:- *$mdrake text1 ,text2*')
    return;
  }

  let arg = args.join(' ');
  const text = arg.split(',')
  const text1 = text[0]
  const text2 = text[1]
  
  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  const image = await jimp.read('Assets/MemeTemplates/drake.jpg');

  try {
    image.print(font,248,7,text1,240);
    image.print(font,248,207,text2,240);
  
    image.getBuffer(`image/png`, async (err, buffer) => {
      const base64File = buffer.toString('base64')
      const media = new MessageMedia('image/png',base64File , 'meme');
      await msg.reply(media)
      await User.getMcd(userid, 'mdrake', 0)
    });;
    
  } catch (error) {
    await msg.reply('Usage:- *$mdrake text1 ,text2*')
  }
      
};

module.exports = {execute};