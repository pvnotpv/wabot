const socket = io();

socket.emit('status', 'status')
socket.emit('logs', 'logs')
socket.emit('cmdsrc', 69)
socket.emit('stcksmd', 69)
socket.emit('totalcmds', 69)
socket.emit('stats', 69)
socket.emit('uptime', 'mgm')

socket.on('start-message', data => {
    document.getElementById('start').innerHTML = data
})

socket.on('stop-message', data => {
    document.getElementById('stop').innerHTML = data
})

socket.on('restart-message', data => {
    document.getElementById('restart').innerHTML = data
})

socket.on('logs', data => {
    document.getElementById('logs').innerHTML = data
})

socket.on('tdrcs', data => {
    document.getElementById('tdrcs').innerHTML = `Commands received:- ${data}`
})

socket.on('uptime', data => {
    document.getElementById('uptime').innerHTML = `Uptime:- ${data}`
})


socket.on('stcksmd', data => {
    document.getElementById('stcksmd').innerHTML = `Stickers made:- ${data}`
})

socket.on('totalcmds', data => {
    document.getElementById('totalcmds').innerText = `Total cmds received:- ${data}`
})

socket.on('stats', date => {
    document.getElementById('stats').innerHTML = `Stats(${date})`
    document.getElementById('stats').style.textDecoration = "underline";
})

function start() {
    socket.emit('start', 'start')
}

function stop() {
    socket.emit('halt', 'stop')
}

function clean() {
    socket.emit('clean', 'clean')
    document.getElementById('logs').innerHTML = ''
}

function restart() {
    socket.emit('restart', 'restart')
}

function refresh() {
    socket.emit('logs', 'logs')
}

socket.on('stat', data => {
    document.getElementById('status').innerHTML = `STATUS:- ${data}`
})

