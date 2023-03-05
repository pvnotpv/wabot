const { MessageMedia } = require('whatsapp-web.js');
const nsfw = require('./nsfwMain.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client,msg) => {
  const userid = String(msg.author.split('@')[0])

  const value = await rClient.get('r34')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']

  async function r34() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from, media)
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
  }

  const cd = await User.getNsfwCd(userid, 'r34', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)

  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }
    
  try {
    await r34()
    await User.getNsfwCd(userid, 'r34', 0)
    await nsfw("rule34+frozenporn+bigherosex+DemonSlayer34","r34")

  } catch (error) {
    await nsfw("rule34+frozenporn+bigherosex+DemonSlayer34","r34")
  }

};

module.exports = {execute};