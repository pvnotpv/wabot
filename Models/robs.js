//  A COMPLETE REWRITE REQUIRED.
const User = require("./user")
const rClient = require("../redis")
const users = require('../dbModels/users')

    // Why the fuck did i make a separate file for rob?
    // i dunno, just fucking felt like it.
class Robs extends User {

    constructor() {
        return;
    }

    static async rob(userid, userRob, luck, stat) {
        const user = await this.user(userid);        
        var userBal = user.balance['walletBal']
        const cooldown = user.cooldowns['rob']
        
        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)
        
        if(cooldown != 0 && inSec < 120) return [2, inSec]
        if(userBal < 100) return [3] 

        const robUser = await this.getRobuser(userRob)
        if(!robUser) return [4]

        var userRobBal = robUser.balance['walletBal']
        if(userRobBal < 100) return [5]
        if(stat == 0) return [0]

        const user_checky = await this.user(userRob)

        const userz = await users.findOne({userid}) // JESUS CHRIST MATE! WTF IS THIS SHTI

        if(stat == 'add') {
            var amount = Math.round(userRobBal/luck) 
            const userAmt = userBal += amount
            user.balance['walletBal'] = userAmt
            userz.balance['walletBal'] = userAmt

            this.uTime(userid, 1)
            await userz.save()
            await rClient.set(userid, JSON.stringify(user))

            var robamt = Math.round(userRobBal/luck)
            const robAmount = userRobBal -= robamt
            robUser.balance['walletBal'] = robAmount
            await this.userRobupdate(userRob, robAmount)

            if(user_checky) await rClient.set(userRob, JSON.stringify(robUser))

            return [amount]
        }

        if(stat == 'sub') {
            const amount = Math.round(userBal/luck)
            const UserBal = userBal
            const amtUser = userBal -= amount

            user.balance['walletBal'] = amount
            userz.balance['walletBal'] = amount

            this.uTime(userid, 1)
            await userz.save()
            await rClient.set(userid, JSON.stringify(user))

            const robamt = Math.round(UserBal/luck)
            const robAmount = userRobBal += robamt

            robUser.balance['walletBal'] = robAmount
            await this.userRobupdate(userRob, robAmount)

            if(user_checky) await rClient.set(userRob, JSON.stringify(robUser))

            return [amount]
        }

        if(stat == 'nan') {
            await this.uTime(userid, 1)
            return;
        }

    }
    static async getRobuser(userid) {
        const userl = await this.user(userid);
        if(userl) return userl;
        const usera = await users.findOne({userid})
        if(!usera) return false
        return usera;

        // AH FUCK
        // JUST CHECKING IF THE ROB DUDE IS PRESENT IN BOTH THE DATABASES;
    }

    static async userRobupdate(userid, Useramt) {
        const user = await users.findOne({userid})
        user.balance['walletBal'] = Useramt
        await user.save()
    }

}

module.exports = Robs;
