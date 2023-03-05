const users = require('../dbModels/users')
const rClient = require("../redis")

async function addUser(userid) {

    const user = new users({
        userid: userid,
        balance: {walletBal: 1000, bankBal: 100, bankMax: 2000},
        picperms: {dickpics:true,boobpics:true},
        curseCheck: {stats: false, firstUsed: null},
        curseWords: {fuck:0,shit:0,cunt:0,pussy:0,cock:0,dick:0,ass:0,penis:0,hell:0,asshole:0,nigga:0,nigger:0,myre:0,faggot:0,dickhead:0,vagina:0,ayn:0,gay:0,piss:0,motherfucker:0,fucked:0,meiran:0,myran:0},
        sticker: {name:'mhm',authorname:'waBot'},
        daily: {daily:0,streak:0}
    });
    await user.save()

    const sUser = await users.findOne({userid}).lean() // .lean() is super important!!
    delete sUser.curseWords //cwh command uses mongodb directly.
    delete sUser.curseCheck
    sUser.cooldowns = {beg:0,gamble:0,rob:0,gib:0,dep:0,with:0,meme:0,animeme:0,mlmeme:0,spam:0,everyone:0,insult:0,ppsize:0,howgay:0,sticker:0,cwh:0,momma:0}
    sUser.imagecooldowns = {imgdlt:0,imgshit:0,imgslap:0,imghitler:0,imgtrash:0}
    sUser.memecooldowns = {mworth:0,mdrake:0,mgru:0,mdisbf:0,mdisgirl:0}
    sUser.nsfwCooldown = {boobs:0,pussy:0,milfs:0,cum:0,asian:0,egirl:0,kimono:0,hentai:0,r34:0,lesbian:0,senddicks:0,dicks:0,ass:0,sendboobs:0}
    sUser.animalCooldowns = {cats:0,dogs:0}
    await rClient.set(userid, JSON.stringify(sUser))
    return 
}

module.exports = addUser;