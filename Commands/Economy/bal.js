const User = require("../../Models/user")

const execute = async (client, msg, args) => {
  const userid = String(msg.author.split('@')[0])

  async function balance(userid, checks) {

    const bal = await User.getBal(userid, checks)
    if(!bal) {
      await msg.reply("Uh oh, I can't find that user.")
      return
    }
    
    const walletBal = await currency(bal.walletBal)
    const bankBal = await currency(bal.bankBal)
    const bankMax = await currency(bal.bankMax)

    await msg.reply(`💰Wallet Balance: *¤ ${walletBal}* \n🏦Bank Balance:   *¤ ${bankBal}* / *${bankMax}*`)
    return;

  }

  if(args.length) {
    const userid = Number(args[0].replace(/\D/g,''));
    var hasNumber = /\d/;   
    if(args[0].indexOf('@') || !hasNumber.test(args[0])) {
      await msg.reply('Usage: *$bal* or *$bal @user*')
      return;
    }
    await balance(userid, 0)
    return;
     
  }

  await balance(userid, 1)
  return;

  async function currency(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}

module.exports = {execute};

