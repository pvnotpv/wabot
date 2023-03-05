const users = require('../dbModels/users')
const addUser = require('./addUser')
const rClient = require("../redis")

class User {

    constructor() {
        return;
    }

    static async user(userid) {
        const user = await rClient.get(userid)
        if(!user) {
            let sUser = await users.findOne({userid}).lean()
            if(!sUser) {
                await addUser(userid)
            } else {
                delete sUser.curseWords //cwh command uses mongodb directly.
                delete sUser.curseCheck
                sUser.cooldowns = {beg:0,gamble:0,rob:0,gib:0,dep:0,with:0,meme:0,animeme:0,mlmeme:0,spam:0,everyone:0,insult:0,ppsize:0,howgay:0,sticker:0,cwh:0,momma:0}
                sUser.imagecooldowns = {imgdlt:0,imgshit:0,imgslap:0,imghitler:0,imgtrash:0}
                sUser.memecooldowns = {mworth:0,mdrake:0,mgru:0,mdisbf:0,mdisgirl:0}
                sUser.nsfwCooldown = {boobs:0,pussy:0,milfs:0,cum:0,asian:0,egirl:0,kimono:0,hentai:0,r34:0,lesbian:0,senddicks:0,dicks:0,ass:0,sendboobs:0}
                sUser.animalCooldowns = {cats:0,dogs:0}
                await rClient.set(userid, JSON.stringify(sUser))
            }
        } else {
            const jUser = JSON.parse(user)
            return jUser;
        }
    }

    static async getBal(userid, checks) {
        if (checks == 0) {
            const bUser = await users.findOne({userid})
            if(!bUser) {return false}
            await this.user(userid)
            return bUser.balance
        }
        let user = await this.user(userid)
        return user.balance;
    }

    static async checkUser(userid) {
        const user = await this.user(userid)
        return 
    }

    static async forBeg(userid, amount) { 
        const user = await this.user(userid)

        const cooldown = user.cooldowns['beg']
        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)
        if(cooldown != 0 && inSec < 35) return [0, inSec]
        if(amount == 696) return[4]
             
        user.balance['walletBal'] += amount
        user.cooldowns['beg'] = Date.now()
        await rClient.set(userid, JSON.stringify(user))

        const mUser = await users.findOne({userid})
        mUser.balance['walletBal'] += amount
        await mUser.save()
        
    }
    
    static async daily(userid) { // broken, fix it
        const user = await users.findOne({userid})
        const daily = user.daily
        const streak = user.streak

        if(daily < 86400000) return [0]
        const days = Date.now() - daily
        
        if(days > 172800000) {
            user.streak = 1
            user.daily = Date.now()
            user.balance['walletBal'] += 1000
            await user.save()
            const day = days / 8.64e+7
            return [1,day]
        }

        const reward = 1000 * streak
        user.balance['walletBal'] += reward
        user.streak += 1
        await user.save()
        return [2,reward,streak+=1]
      
    }

    static async gamble(userid, amount, luck) {

        const user = await this.user(userid)
        var userBal = user.balance['walletBal']
        const cooldown = user.cooldowns['gamble']

        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)
        
        if(cooldown != 0 && inSec < 20) return [2, inSec]
        if(luck == 5 && userBal < amount) return [3]
        if(luck == 5) return [6]

        const sUser = await users.findOne({userid})

        if(luck == 0) {
            const toSub = userBal -= amount
            user.balance['walletBal'] = toSub
            user.cooldowns['gamble'] = Date.now()
            await rClient.set(userid, JSON.stringify(user))

            sUser.balance['walletBal'] = toSub
            await sUser.save()

        } else if(luck == 1) {
            const toAdd = userBal += amount
            user.balance['walletBal'] = toAdd
            user.cooldowns['gamble'] = Date.now()
            await rClient.set(userid, JSON.stringify(user))

            sUser.balance['walletBal'] = toAdd
            await sUser.save()

        } else if(luck == 2) {
            user.cooldowns['gamble'] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
        }


    }

    static async uTime(userid, stat) {
        const user = await this.user(userid)
        const cooldown = user.cooldowns['rob']
        if(stat == 0) return cooldown;

        user.cooldowns['rob'] = Date.now()
        await rClient.set(userid, JSON.stringify(user))
    }
    
    static async sticker(userid, stat) {
        const user = await this.user(userid)
        const cooldown = user.cooldowns['sticker']

        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)
        if(cooldown != 0 && inSec < 7) return [0, inSec]

        if(stat) {
            user.cooldowns['sticker'] = Date.now()
            await rClient.set(userid, JSON.stringify(user))
            return;
        } 
        return [user.sticker['name'], user.sticker['authorname']]

        
    }

    static async depost(userid, amount) {
        const user = await this.user(userid)
        const userBal = user.balance['walletBal']
        const userBank = user.balance['bankBal']
        const userMax = user.balance['bankMax']
        const cooldown = user.cooldowns['dep']

        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)

        if(cooldown != 0 && inSec < 25) return [0, inSec]
        if(userBal < amount) return [1]
        const maxDep = userMax - userBank
        if(maxDep < amount || maxDep == 0) return [2, userMax]

        user.balance['walletBal'] -= amount
        user.balance['bankBal'] += amount
        user.cooldowns['dep'] = Date.now()
        await rClient.set(userid, JSON.stringify(user))
        try { return [3] } finally {
            const mUser = await users.findOne({userid})
            mUser.balance['walletBal'] -= amount
            mUser.balance['bankBal'] += amount
            await mUser.save()
        }
    }

    static async withdraw(userid, amount) {
        const user = await this.user(userid)
        const userBank = user.balance['bankBal']
        const userBal = user.balance['walletBal']
        const cooldown = user.cooldowns['with']
        const timeMS = Date.now() - cooldown
        const inSec = Math.floor(timeMS / 1000)

        if(cooldown != 0 && inSec < 25) return [0, inSec]
        if(userBank < amount) return [1]
        const amt = userBal + amount
        
        try {
            user.balance['walletBal'] += amount
            user.balance['bankBal'] -= amount
            user.cooldowns['with'] = Date.now()
            rClient.set(userid, JSON.stringify(user))
            return [2, amt]
        } finally {
            const sUser = await users.findOne({userid})
            sUser.balance['walletBal'] += amount
            sUser.balance['bankBal'] -= amount
            await sUser.save()
        }
    }

    static async curseCheck(userid, word) {
        const user = await users.findOne({userid})
        user.curseWords[word] += 1
        await user.save()
    }


}

module.exports = User;
