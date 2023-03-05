//  A COMPLETE REWRITE REQUIRED.
const User = require("./user")
const rClient = require("../redis")
const users = require('../dbModels/users')

    // Why the fuck did i make a separate file for gib?
    // i dunno, just fucking felt like it.
class Gibs extends User {

    constructor() {
        return;
    }

    static async give(userid, usergib, amount) {
        const user = await this.user(userid)
        const userBal = user.balance['walletBal']
        const cooldown = user.cooldowns['gib']

        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)

        if(cooldown != 0 && inSec < 40) return [0, inSec]
        if(userBal < amount) return [1, userBal]
        const gibUser = await this.gibUser(usergib) 
        if(!gibUser) return false

        const amt = userBal - amount
        gibUser.balance['walletBal'] += amount
        await rClient.set(usergib, JSON.stringify(gibUser))

        const userz = await users.findOne({userid}) // JESUS CHRIST MATE! WTF IS THIS SHTI

        try {
            user.balance['walletBal'] -= amount
            userz.balance['walletBal'] -= amount
            user.cooldowns['gib'] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            await userz.save()
            return [2, amt]

        } finally {
            await this.gibuserupdate(usergib, amount)

        }
    }

    static async gibUser(userid) {
        const userl = await this.user(userid);
        if(userl) return userl;
        const usera = await users.findOne({userid})
        if(!usera) return false
        return usera;
    }

    static async gibuserupdate(userid, Useramt) {
        const user = await users.findOne({userid})
        user.balance['walletBal'] += Useramt
        await user.save()
    }

}

module.exports = Gibs;
