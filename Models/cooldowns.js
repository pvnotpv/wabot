const User = require("./user")
const rClient = require("../redis")

class Cooldowns extends User {

    constructor() {
        return;
    }

    static async getCd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.cooldowns[command]
        if(checks == 0) {
            user.cooldowns[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown;
    }

    static async getAnimalCd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.animalCooldowns[command]
        if(checks == 0) {
            user.animalCooldowns[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown;
    }

    static async getNsfwCd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.nsfwCooldown[command]
        if(checks == 0) {
            user.nsfwCooldown[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown;
    }

    static async getMemeCd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.cooldowns[command]
        if(checks == 0) {
            user.cooldowns[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown;
    }

    static async getImgCd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.imagecooldowns[command]
        if(checks == 0) {
            user.imagecooldowns[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown
    }

    static async getMcd(userid, command, checks) {
        const user = await this.user(userid)
        const cooldown = user.memecooldowns[command]
        if(checks == 0) {
            user.memecooldowns[command] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return
        }
        return cooldown
    } 
}

module.exports = Cooldowns;
