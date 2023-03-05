const client = require('./main')
const http = require('http')
const util = require('util')
const express = require('express')
const qrcode = require('qrcode')
const fs = require("fs")
const Bot = require('./dbModels/bot');
const rClient = require("./redis")

const app = express()
const server = http.createServer(app);
const io = require('socket.io')(server);
const log_file = fs.createWriteStream('public' + '/logs.log', {flags : 'w'});
const log_stdout = process.stdout;

const nsfw = require('./Commands/NSFW/nsfwMain')


app.use(express.static('public'))
process.env.TZ = "Asia/Kolkata"; // CHANGE TIMEZONE

console.log = function(d) { 
    log_file.write('~ ' + util.format(d) + '\n');
    log_stdout.write('* ' + util.format(d) + '\n');
};

app.get('/qrcode', (req, res) => {
    res.sendFile('qr.html', {
      root: 'public'
    });
});

var obj = {
    "memes" : 0,    
    "animeme" : 0,
    "mlmeme": 0,
    "cats": 0,
    "dogs": 0
};

var nsfwobj = {
    "asian": 0,
    "ass": 0,
    "boobs": 0,
    "cum": 0,
    "egirl": 0,
    "hentai": 0,
    "kimono": 0,
    "lesbian": 0,
    "milfs": 0,
    "pussy": 0,
    "r34": 0,
    "dick": 0
}

async function check(id) {
    const utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    const stat = await Bot.findOne({id})
    const date = stat.date
    if(utc == date) return;
    stat.date = utc
    stat.tdcmds = 0
    stat.stcksmd = 0
    await stat.save()
}

io.on('connection', socket => {
    socket.on('start', async (msg) => {
        try {
            console.log('-> Start request received')
            socket.emit('start-message', 'STARTING...')
            await client.initialize()
            socket.emit('start-message', 'STARTED')
            socket.emit('stat', 'ONLINE')
        } catch (error) {
            console.log(error)
            socket.emit('start-message', 'FAILED.')
        }
    })

    socket.on('status', async (msg) => {
        try {
            const stat = await client.getState()
            if(stat === 'CONNECTED') {
                socket.emit('stat', 'ONLINE')
            } else {
                socket.emit('stat', 'OFFLINE')
                socket.emit('start-message', 'START')
            }
        } catch (error) {
            socket.emit('stat', 'OFFLINE')
            socket.emit('start-message', 'START')
        }
    })

    socket.on('halt', async(msg) => {
        try {
            console.log('-> Halt request received.'+await date())
            await client.destroy()
            socket.emit('stop-message', 'HALTED')
            socket.emit('stat', 'OFFLINE')
            socket.emit('start-message', 'START')
        } catch (error) {
            console.log(error)
            socket.emit('stop-message', 'FAILED.')
        }
        
    })

    socket.on('restart', async(msg) => {
        try {
            console.log('-> Restart request received.')
            socket.emit('restart-message', 'RESTARTING...')
            await client.destroy()
            await client.initialize()
            socket.emit('stat', 'ONLINE')
            socket.emit('restart-message', 'RESTARTED.')
        } catch (error) {
            console.log(error)
            socket.emit('restart-message', 'FAILED.')
        }
        
    })

    socket.on('cmdsrc', async(msg) => {
        try {
            await check(69)
            const stat = await Bot.findOne({msg})
            const tdrcs = stat.tdcmds
            socket.emit('tdrcs', tdrcs)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('stcksmd', async(msg) => {
        try {
            await check(69)
            const stat = await Bot.findOne({msg})
            const stcks = stat.stcksmd
            socket.emit('stcksmd', stcks)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('totalcmds', async(msg) => {
        try {
            const stat = await Bot.findOne({msg})
            const cmds = stat.commands
            socket.emit('totalcmds', cmds)
        } catch (error) {
            console.log(error)
        }
    })

    const readLogs = async function (file) {
        return fs.readFileSync(file).toString()
    };

    socket.on('logs', async(msg) => {
        const logs = await readLogs('public/logs.log');
        socket.emit('logs', logs)
    })

    socket.on('qrcode', async(msg) => {
        console.log('qrCode request received | '+await date())
        client.initialize();
        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                socket.emit('qr', url);
            });
        });
    })

    socket.on('stats', async(msg) =>{
        const stat = await Bot.findOne({msg})
        const date = stat.date
        socket.emit('stats', date)
    })

    socket.on('uptime', async(msg) => {
        const uptime = await rClient.get('uptime')
        const teim = await time(Number(uptime))
        socket.emit('uptime', teim)
    })

    socket.on('clean', async(msg) => {
        fs.writeFile('public/logs.log', '', function(){
            socket.emit('logs', '')
        })
    })

})

async function time(mins){
    var days = Math.trunc(mins/1440)
    var hours = Math.trunc(mins/60);
    var minutes = mins % 60;
    const teim = `${days} days ${hours} hours ${minutes} mins`
    return teim
}

async function date() {
    return new Date().toLocaleString();
}

setInterval(async function uptimecheck(){
    let upTime = await rClient.get('uptime')
    let uptime = Number(upTime)
    let stopStats = await rClient.get('stop')
    let stop = Boolean(stopStats)
    await check(69)
    try {
        const stat = await client.getState()
        if(stat === 'CONNECTED') {
            uptime += 15
            await rClient.set('uptime', uptime)
        } else {
            if(stop) return
            console.log('Downtime detected !!!'+await date())
            stop = true
            await rClient.set('stop', stop)
        }

    } catch (error) {
        if(stop) return;
        console.log('Downtime detected !!! '+await date())
        stop = true
        await rClient.set('stop', stop)
    }

}, 900000);


server.listen(8080, async () => {
    await rClient.flushdb()
    const uptime = await rClient.get('uptime')
    const stop = await rClient.get('stop')
    await rClient.set('time', JSON.stringify(obj))
    await rClient.set('nsfwtime', JSON.stringify(nsfwobj))

    if(!uptime || !stop) {
        await rClient.set('stop', false) 
        await rClient.set('uptime', 0)
    }
    console.log('Listening on -> 8080');

    // WHAT IS HAPPENING HERE ?!!!
    // THE BOT JUST LOADS IMAGE URLS FROM REDDIT TO REDIS
    await nsfw("JapaneseHotties+AsianNSFW","asian")
    await nsfw("ass+assholegonewild","ass")
    await nsfw("boobs+hugeboobs+ratemyboobs","boobs")
    await nsfw("creampie+cumfetish+creampies+amateurcumsluts+cum+CumOverdose+cumsluts","cum")
    await nsfw("hentai+hentaifemdom+hentaibondage","hentai")
    await nsfw("WafukuAsians+Kimono_NSFW","kimono")
    await nsfw("LesbiansX","lesbian")
    await nsfw("EGirls+EGirlThots","egirl")
    await nsfw("milfs+MILFS+maturemilf+realmoms","milfs")
    await nsfw("pussy+vagina+asshole+shavedpussies","pussy")
    await nsfw("rule34+frozenporn+bigherosex+DemonSlayer34","r34")
    await nsfw("MassiveCock+penis","dick")
});

module.exports = rClient