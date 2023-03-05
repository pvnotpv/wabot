const { MessageMedia } = require('whatsapp-web.js');
const nsfw = require('./nsfwMain.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client,msg) => {
  const userid = String(msg.author.split('@')[0])

  const value = await rClient.get('boobs')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']

  async function boobs() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from, media)
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
  }

  const cd = await User.getNsfwCd(userid, 'boobs', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)

  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }
    
  try {
    await boobs()
    await User.getNsfwCd(userid, 'boobs', 0)
    await nsfw("boobs+hugeboobs+ratemyboobs","boobs")

  } catch (error) {
    await nsfw("boobs+hugeboobs+ratemyboobs","boobs")
  }

};

module.exports = {execute};