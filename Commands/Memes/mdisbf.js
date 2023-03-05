const { MessageMedia } = require('whatsapp-web.js');
const User = require("../../Models/cooldowns")
const jimp = require(`jimp`);

const execute = async (client, msg, args) => {
    
    const userid = String(msg.author.split('@')[0])
    const cd = await User.getMcd(userid, 'mdisbf', 1)

    const timeMS = Date.now() - cd
    const inSec = Math.floor(timeMS / 1000)
    
    if(cd != 0 && inSec < 12) {
        const time = 12 - inSec
        await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
        return;
    }

    if(!args.length || !args[1] || !args[2]) {
        await msg.reply('Usage:- *$mdisbf text1 ,text2 ,text3*')
        return;
    }

    let arg = args.join(' ');
    const text = arg.split(',')
    const text1 = text[0]
    const text2 = text[1]
    const text3 = text[2]
    
    const font = await jimp.loadFont('Assets/Fonts/disbffont/font.fnt');
    const image = await jimp.read('Assets/MemeTemplates/disbf.jpg');

    try {
        image.print(font,150,480,text1,400);
        image.print(font,560,320,text2,400);
        image.print(font,880,500,text3,400);
    
        image.getBuffer(`image/png`, async function(err, buffer) {
            const base64File = buffer.toString('base64')
            const media = new MessageMedia('image/png',base64File , 'meme');
            await msg.reply(media)
            await User.getMcd(userid, 'mdisbf', 0)
        });;
    } catch (error) {
        await msg.reply('Usage:- *$mdisbf text1 ,text2 ,text3*')
    }
    
};

module.exports = {execute};