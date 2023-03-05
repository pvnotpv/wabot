const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require("fs")
const bot = require("./Models/bot");
const User = require("./Models/user")
const Group = require("./Models/group")
const Bot = require('./dbModels/bot');
const Groups = require("./dbModels/groups")
const rClient = require("./redis")
const newMeme = require('./Commands/MEMEY/newMeme')
const animals = require("./Commands/ANIMALS/animalsMain")

const client = new Client({
    authStrategy: new LocalAuth(),
    qrTimeoutMs: 0,
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--unhandled-rejections=strict"
        ]
    }
});


client.commands = new Map();

const commandFolders = fs.readdirSync("./Commands");
for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"))
      for (const file of commandFiles) {
      const command = require(`./Commands/${folder}/${file}`);
      let commandName = file.replace(".js", "");
      client.commands.set(commandName, command);
    }
}

client.on('ready', async() => {
    console.log('-> Bot is ready! '+await date())
    await rClient.set('uptime', 0)
})

client.on('disconnected', async(reason) => {
    console.log('-> Disonnected, Attempting to restart. '+await date())   
    console.log(`-> Reason:- ${reason}.`) 
    try {
        client.destroy();
        client.initialize()
        console.log('-> RESTARTED SUCCESSFULLY.')
    } catch (error) { console.log('-> FAILED TO RESTART.')}
});

client.on('ready', async() => {
    await newMeme("memes+dankememes", "memes")
    await newMeme("marvelmemes+MarvelPrequelMemes","mlmeme")
    await newMeme("Animemes+goodanimemes","animeme")

    await animals("cats", "cats")
    await animals("rarepuppers","dogs")

})


client.on('message', async (msg) => {
    const chat = await msg.getChat();
    if (!chat.isGroup) return
    const char = msg.body.toLowerCase()
    const curse = ["fuck", "shit", "cunt","pussy","cock","dick","ass","penis","hell","asshole","nigga","nigger","myre","faggot","dickhead","vagina","ayn","gay","piss","motherfucker","fucked"]
    if (curse.some(v => char === v)) {
        const userid = String(msg.author.split('@')[0])
        await User.curseCheck(userid, char)
    }
});

client.on('message_revoke_everyone', async (msg, text) => {
    const chat = await text.getChat();
    if(text.hasMedia) return;
    await Group.getGroup(msg.from, chat.name)

    const group = await rClient.get(msg.from)
    const userid = String(msg.author.split('@')[0])
    const time = new Date().toLocaleTimeString();
    const msge = `Time: ${time} \nAuthor: ${userid} \nMessage: ${text.body}`
    
    const mGroup = JSON.parse(group)
    if(!mGroup.dlstat) return;
    mGroup.dlmsgs.push(msge)
    
    await rClient.set(msg.from, JSON.stringify(mGroup))

});

async function nsfwCheck(msg) {
    if(msg.body == "$asian" || msg.body == "$ass" || msg.body == "$boobs" || msg.body == "$cum" || msg.body == "$egirl" || msg.body == "$hentai" || msg.body == "$kimono" || msg.body == "$lesbian" || msg.body == "$milfs" || msg.body == "$pussy" || msg.body == "$r34") {
        const groupId = msg.from
        const group = await Groups.findOne({groupId}) 
        const nsfwstat = group.nsfw
  
        if(!nsfwstat) { return false
        } else {  return true  }
    } else return true
}


client.on('message', async (msg) => {
    if (msg.body.startsWith("$") || msg.body.startsWith("@")) {

        const chat = await msg.getChat();
        if (!chat.isGroup) {
            await msg.reply("This bot does not accept dm's, please invite it to a group.")
            return;
        }
        const userid = String(msg.author.split('@')[0])

        let args = msg.body.slice(1).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        if (client.commands.has(command)) {

            await User.checkUser(userid)
            await Group.getGroup(msg.from, chat.name)

            try {
              const nsfw = await nsfwCheck(msg)
              if(!nsfw) {
                await msg.reply('!!! NSFW COMMANDS ARE DISABLED HERE, ENTER *$enable nsfw* to use them. !!!')
                return;
              }
              await client.commands.get(command).execute(client, msg, args);
              await bot.update(69)
            } catch (error) {
                console.log(error)
                await msg.reply('Uh oh , please try again.')
            }
        } 
    }
});

async function check(id) {
    const utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    const stat = await Bot.findOne({id})
    const date = stat.date
    if(utc == date) return;
    stat.date = utc
    stat.tdcmds = 0
    stat.stcksmd = 0
    await stat.save()
}


async function date() {
    return new Date().toLocaleString();
}


module.exports = client


