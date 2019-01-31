const server = require('./server.js')
const io = require('socket.io')(server)

var users = []
io.on('connection', (socket) => {
    socket.userName = 'Anonymous'
    let colors = ['red', 'blue', 'pink', 'yellow']
    let color = colors[Math.floor(Math.random() * 1000) % colors.length]
    let user = {
        userName: socket.userName,
        id: socket.id,
        color: color,
        lastMessage: 'last message',
        img: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'}
    users.push(user)
    console.log(`A new user is connected... ID: ${socket.id} | Users No: ${users.length}`)

    // disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.userName}, ${socket.id} is disconnected.`)
        users = users.filter((user, idx, array) => {
            return user.id !== socket.id
        })
        socket.broadcast.emit('usersChanged')
    })
    // listen to change userName
    socket.on('change_username', (data) => {
        socket.userName = data.userName
    })
    // listen to new message
    socket.on('new_message', (data) => {
        // broadcast new message
        io.sockets.emit('new_message', {message: data.message, userName: socket.userName})
    })

    socket.on('register', (fullname, username, password, cb) => {
        let loggedUser = {}
        users.forEach((user, idx, arr) => {
            if (user.id === socket.id) {
                user.fullname = fullname
                user.userName = username
                user.password = password
                loggedUser = user
            }
        })
        cb(loggedUser, users)
    })

    socket.emit('getAvailableUsers', users, user)

    socket.broadcast.emit('usersChanged')
    socket.on('usersChanged', () => {
        socket.emit('getAvailableUsers', users, user)
    })
})