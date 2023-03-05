const { MessageMedia } = require('whatsapp-web.js');
const animals = require('./animalsMain.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client,msg) => {
  const userid = String(msg.author.split('@')[0])
    
  const value = await rClient.get('dogs')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']

  async function dog() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from, media, {caption: '<3'})
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
    
  }

  const cd = await User.getAnimalCd(userid, 'dogs', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)
  
  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there kiddo, try again in *${time}s*.`)
    return;
  }

  try {
    await dog()
    await User.getAnimalCd(userid, 'dogs', 0)
    await animals("rarepuppers","dogs")

  } catch (error) {
    await animals("rarepuppers","dogs")
  }

};

module.exports = {execute};