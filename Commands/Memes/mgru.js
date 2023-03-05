const { MessageMedia } = require('whatsapp-web.js');
const User = require("../../Models/cooldowns")
const jimp = require(`jimp`);

const execute = async (client,msg,args) => {
  const userid = String(msg.author.split('@')[0])
  const cd = await User.getMcd(userid, 'mgru', 1)

  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)
    
  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }

  if(!args.length || !args[1]) {
    await msg.reply('Usage:- *$mgru text1 ,text2 ,text3 ,text4*')
    return;
  }
  
  let arg = args.join(' ');
  const text = arg.split(',')
  const text1 = text[0]
  const text2 = text[1]
  const text3 = text[2]
  const text4 = text[3]
  
  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  const image = await jimp.read('Assets/MemeTemplates/gru.jpg');

  try {
    image.print(font,210,50,text1,100);
    image.print(font,560,50,text2,100);
    image.print(font,210,280,text3,100);
    image.print(font,560,280,text4,100);
  
    image.getBuffer(`image/png`, async (err, buffer) => {
      const base64File = buffer.toString('base64')
      const media = new MessageMedia('image/png',base64File , 'meme');
      await msg.reply(media)
      await User.getMcd(userid, 'mgru', 0)
    });;
    
  } catch (error) {
    await msg.reply('Usage:- *$mgru text1 ,text2 ,text3 ,text4*')
  }

  
                     
};

module.exports = {execute};