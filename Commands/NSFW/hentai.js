const { MessageMedia } = require('whatsapp-web.js');
const nsfw = require('./nsfwMain.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client,msg) => {
  const userid = String(msg.author.split('@')[0])

  const value = await rClient.get('hentai')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']

  async function hentai() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from, media)
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
  }

  const cd = await User.getNsfwCd(userid, 'hentai', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)

  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }
    
  try {
    await hentai()
    await User.getNsfwCd(userid, 'hentai', 0)
    await nsfw("hentai+hentaifemdom+hentaibondage","hentai")

  } catch (error) {
    await nsfw("hentai+hentaifemdom+hentaibondage","hentai")
  }

};

module.exports = {execute};