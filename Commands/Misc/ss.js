const {MessageMedia} = require('whatsapp-web.js');

const execute = async (client,msg,args) => {
    
    const chat = await msg.getChat();
        if (!chat.isGroup) {
            client.sendMessage(msg.from, 'This command can only be used in a group.')
        return
    }

    await client.interface.openChatWindow(msg.from)
    const screenshot = await client.pupPage.screenshot(
        {
        clip: {
            x: 310,
            y: 100,
            width: 500,
            height: 500
        },   
        type: "png", 
        encoding: "base64"
        }
    );
    const media = new MessageMedia("image/png", screenshot);
    msg.reply(media)
}

module.exports = {execute};



