const { MessageMedia } = require('whatsapp-web.js');
const User = require("../../Models/cooldowns")
const jimp = require(`jimp`);

const execute = async (client,msg,args) => {
  const userid = String(msg.author.split('@')[0])
  const cd = await User.getMcd(userid, 'mdisgirl', 1)

  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)
    
  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }

  if(!args.length || !args[1]) {
    await msg.reply('Usage:- *$mdisgirl text1 ,text2*')
    return;
  }
  
  let arg = args.join(' ');
  const text = arg.split(',')
  const text1 = text[0]
  const text2 = text[1]
  
  const font = await jimp.loadFont('Assets/Fonts/disgirlfont/font.fnt');
  const image = await jimp.read('Assets/MemeTemplates/disgirl.jpg');

  try {
    image.print(font,25,20,text1,300);
    image.print(font,30,250,text2,300);
  
    image.getBuffer(`image/png`, async function (err, buffer) {
      const base64File = buffer.toString('base64')
      const media = new MessageMedia('image/png',base64File , 'meme');
      await msg.reply(media)
      await User.getMcd(userid, 'mdisgirl', 0)
    });
  
  } catch (error) {
    await msg.reply('Usage:- *$mdisgirl text1 ,text2*')
  }
                   
};

module.exports = {execute};