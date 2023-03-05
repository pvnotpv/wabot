const socket = io();

function qrcode() {
    document.getElementById('qr').innerHTML = 'Sending request'
    socket.emit('qrcode', 'qr')
}

socket.on('qr', data => {
    document.getElementById('qr').innerText = 'Qr received.'
    const image = document.getElementById("qrcode");
    image.src = data
})
