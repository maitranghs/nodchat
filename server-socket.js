const server = require('./server.js')
const io = require('socket.io')(server)

var Member = require('./models/Member.js')
var History = require('./models/History.js')

var users = []
var user = {}
io.on('connection', (socket) => {
    console.log(`A socket client is openned... : ${socket.id}`)

    // disconnected
    socket.on('disconnect', () => {
        console.log(`${user.userName}, ${socket.id} is disconnected.`)
        users = users.filter((user, idx, array) => {
            return user.socketId !== socket.id
        })
        socket.broadcast.emit('usersChanged')
    })

    // *************************************
    // Not use in React client chat
    // listen to change userName
    socket.on('change_username', (data) => {
        socket.userName = data.userName
    })
    // listen to new message
    socket.on('new_message', (data) => {
        // broadcast new message
        io.sockets.emit('new_message', {message: data.message, userName: socket.userName})
    })
    // *************************************

    // Login or Register
    socket.on('register', (fullName, userName, password, cb) => {
        socket.userName = 'Anonymous'
        let colors = ['red', 'blue', 'pink', 'yellow']
        let color = colors[Math.floor(Math.random() * 1000) % colors.length]
        user = {
            fullName: fullName,
            userName: userName,
            password: password,
            socketId: socket.id,
            color: color,
            lastMessage: '',
            img: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
        }
        Member.logUserIn(user, (err, dbUser) => {
            if (err) {
                cb(err)
            } else {
                console.log(`A new user is joined... ID: ${socket.id} | Users No: ${users.length}`)
                user.id = dbUser._id
                users.push(user)
                socket.broadcast.emit('usersChanged')
                cb(null, user, users)
            }
        })
    })

    socket.emit('getAvailableUsers', users, user)

    socket.on('usersChanged', () => {
        socket.emit('getAvailableUsers', users, user)
    })

    socket.on('getHistory', (fromId, toId, cb) => {
        History.find({
            $or: [
                {
                    $and: [{from: fromId}, {to: toId}]
                },
                {
                    $and: [{from: toId}, {to: fromId}]
                }
            ]
        })
        .populate('from')
        .exec((err, docs) => {
            if (err) {
                cb(err)
            } else {
                console.log(docs)
                cb(null, docs)
            }
        })
    })
    
    socket.on('message', (fromId, toId, message, cb) => {
        let newMessage = {
            createdTime: Date.now(),
            from: fromId,
            to: toId,
            content: message,
            deleteFlag: '0'
        }
        History.create(newMessage, (err, data) => {
            if (err) {
                cb(err)
            } else {
                Member.findById(fromId, (err, from) => {
                    if (err) {
                        cb(err)
                    } else {
                        let newHistory = { from: from, content: message}
                        cb(null, newHistory)
                    }
                })
            }
        })
    })
})