const { MessageMedia } = require('whatsapp-web.js');
const nsfw = require('./nsfwMain.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client,msg) => {
  const userid = String(msg.author.split('@')[0])

  const value = await rClient.get('cum')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']

  async function cum() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from, media)
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
  }

  const cd = await User.getNsfwCd(userid, 'cum', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)

  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }
    
  try {
    await cum()
    await User.getNsfwCd(userid, 'cum', 0)
    await nsfw("creampie+cumfetish+creampies+amateurcumsluts+cum+CumOverdose+cumsluts","cum")

  } catch (error) {
    await nsfw("creampie+cumfetish+creampies+amateurcumsluts+cum+CumOverdose+cumsluts","cum")
  }

};

module.exports = {execute};