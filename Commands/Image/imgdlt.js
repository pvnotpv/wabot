const { MessageMedia } = require('whatsapp-web.js');
const fs = require("fs");
const jimp = require(`jimp`);
const User = require("../../Models/cooldowns")
const path = require('path');
const os = require('os');

const execute = async (client, msg) => {

    const userid = String(msg.author.split('@')[0])
    const cd = await User.getImgCd(userid, 'imgdlt', 1)

    const timeMS = Date.now() - cd
    const inSec = Math.floor(timeMS / 1000)
    
    if(cd != 0 && inSec < 15) {
        const time = 15 - inSec
        await msg.reply(`Woah slow down there man, try again in *${time}s*.`)
        return;
    }

    const quotedMsg = await msg.getQuotedMessage();

    if(msg.hasMedia) {
        const mediaData = await msg.downloadMedia()
        await print(mediaData)
        return;
    }

    async function print(mediafile) {

        if (mediafile.mimetype === 'application/pdf' || mediafile.mimetype === 'video/mp4') {
            await msg.reply('waht')
            return
        }
        if (mediafile.mimetype === 'image/webp') {
            await msg.reply('sticker support coming soon just send a pic for now');
            return

        }

        const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'image'));
        fs.writeFile(`${folder}/imgdlt.jpg`,mediafile.data,"base64",function (err) {if (err) {console.log(err);}});

        try {
            let bg = await jimp.read('Assets/MemeTemplates/delete.png');
            image = await jimp.read(`${folder}/imgdlt.jpg`);
            image.resize(190, 190);
            bg.composite(image, 120, 140);
            let raw;

            bg.getBuffer(`image/png`, async (err, buffer) => {
                const base64File = buffer.toString('base64')
                const media = new MessageMedia('image/png',base64File , 'dlt');
                await msg.reply(media)
                fs.rmSync(folder, { recursive: true, force: true });
                await User.getImgCd(userid, 'imgdlt', 0)
                return;
            });;

        } catch (error) {
            await msg.reply('please resend the media and try again.')
        }
    }

    try {
        if(quotedMsg.hasMedia)  {
            var mediafile = await quotedMsg.downloadMedia();
            await print(mediafile)
            return;
        }
    } catch (error) {
        await msg.reply('Just send a pic with *$imgdlt* as caption or quote one.')
    }

    
};



module.exports = {execute};