const { MessageMedia } = require('whatsapp-web.js');
const newMeme = require('./newMeme.js')
const User = require("../../Models/cooldowns")
const rClient = require("../../redis")

const execute = async (client, msg) => {
  const userid = String(msg.author.split('@')[0])

  const value = await rClient.get('memes')
  const obj = JSON.parse(value);
  const reobj = eval(obj)
  const name = reobj[Math.floor(Math.random()*reobj.length)];

  const url = name['link']
  const memey = name['name']

  async function meme() {
    try {
      const media = await MessageMedia.fromUrl(url)
      await client.sendMessage(msg.from,media, {caption: memey})
      return;
      
    } catch (error) {
      await msg.reply('please try again.')
      
    }
  }

  const cd = await User.getMemeCd(userid, 'meme', 1)
  const timeMS = Date.now() - cd
  const inSec = Math.floor(timeMS / 1000)

  if(cd != 0 && inSec < 12) {
    const time = 12 - inSec
    await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
    return;
  }

  try {
    await meme()
    await User.getMemeCd(userid, 'meme', 0)
    await newMeme("memes+dankememes","memes")

  } catch (error) {
    await newMeme("memes+dankememes","memes")
}
    

}

module.exports = {execute};