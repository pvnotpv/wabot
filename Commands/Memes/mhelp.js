const execute = async (client, msg) => {
    await msg.reply("- There are templates which require more than 1 argument so separate each one with a comma. \n- For better results don't remove the whitespace between the 2nd text and comma. \n- Eg:- Use *$mcommmand text1 ,text2* instead of *$mcommand text1, text2*");
}

module.exports = {execute};