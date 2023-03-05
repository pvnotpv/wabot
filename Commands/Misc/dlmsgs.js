const rClient = require('../../redis')

const execute = async (client, msg) => {
    const group = await rClient.get(msg.from)
    const sGroup = JSON.parse(group)

    if(!sGroup.dlstat) {
        await msg.reply('Command disabled here.')
        return;
    }

    const msgs = sGroup.dlmsgs.reverse()

    if(!msgs) {
        await msg.reply('Nothing to show.')
        return;
    }

    let text = msgs.join()
    let dlMsgs = text.replace(/,/g, '\n\n')
    await msg.reply('*DELETED MESSAGES*' + '\n\n' + dlMsgs)

}

module.exports = {execute};