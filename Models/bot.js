const bot = require('../dbModels/bot')

class Bot {

    constructor() {
        return;
    }

    static async update(id) {
        let bots = await bot.findOne({id})
        bots.commands += 1
        bots.tdcmds += 1
        await bots.save()
    }

}

module.exports = Bot;
