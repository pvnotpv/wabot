const rClient = require('../../redis')
const { Configuration, OpenAIApi } = require("openai");
const { MessageMedia } = require('whatsapp-web.js');

// ISSUES WITH THE WHATSAPP API, HIGH CHANCE OF BREAKING THE BOT. SO DON'T USE THIS COMMAND :) 

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);


const execute = async (client, msg, args) => {
    if(!args.length) {
        await msg.reply("- Usage: $dalle text\n- Eg:- *$dalle Servers on fire*\n- NSFW REQUESTS ARE NOT ACCEPTED!")
        return;
    }
    await msg.reply("Aight, sending request.")
    args = args.join(' ').replace(/[\[\]&]+/g, '');

    try {
        const response = await openai.createImage({
            prompt: args,
            n: 2,
            size: "1024x1024",
        });
        image_url = response.data.data[0].url;
        const media = await MessageMedia.fromUrl(image_url)
        await client.sendMessage(msg.from, media, {caption: args})
        
    } catch (error) {
        console.log(error)
        await msg.reply("Smtn happened, please try again.")
    }

 
    
}


module.exports = {execute};