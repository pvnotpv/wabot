const snoowrap = require('snoowrap');
const rClient = require("../../redis")
require('dotenv').config()

const r = new snoowrap({
    userAgent: process.env.userAgent,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    username: process.env.username,
    password: process.env.password,
    refreshToken: process.env.refreshToken,
    accessToken: process.env.accessToken
});

const queryOptions = {
    limit: 100,
};

async function newMeme(sub_names, name) {
    const time = await rClient.get('time')
    
    const teim = JSON.parse(time)
    const coolDown = Date.now() - teim[name]
    const inSec = Math.floor(coolDown / 1000)
    if(inSec < 5) return;
    
    r.getSubreddit(sub_names)
    .getHot(queryOptions)
    .then( 
        async (posts) => {
            const allPosts = []
            posts.forEach(
                (post) => {
                    if(post.url.endsWith('.jpg') || post.url.endsWith('.png') || post.url.endsWith('.jpeg')) {
                        allPosts.push({
                            name: post.title,
                            link: post.url
                        })
                   
                    }

                }
            )   
        const postsIn_Json = JSON.stringify(allPosts)
        await rClient.set(name, JSON.stringify(postsIn_Json))


        teim[name] = Date.now()
        await rClient.set("time", JSON.stringify(teim))
    })
    
}

module.exports = newMeme;