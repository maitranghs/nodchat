var app = require('./app.js')
const port = process.env.NODE_ENV || 3000

var server = app.listen(port, () => {
    console.log(`Node chat server is running on port: ${port}`)
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('A new user is connected.')
    socket.username = 'Anonymous'

    // listen to change username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    // Listen to new message
    socket.on('new_message', (data) => {
        // broadcast new message
        io.sockets.emit('new_message', {message: data.message, username: socket.username})
    })
})