(function () {
    // make connection
    var socket = io.connect('http://127.0.0.1:3000')

    var sendMessage = function () {
        // if username is have value
        var username = document.getElementById('username').value
        if (username) {
            socket.emit('change_username', {username: username})
        }

        var message = document.getElementById('message').value
        socket.emit('new_message', {message: message})
        document.getElementById('message').value = ''
    }    

    // to handle adding a new message
    document.getElementById('send_message').addEventListener('click', sendMessage)

    document.getElementById('message').addEventListener('keyup', (event) => {
        event.preventDefault()
        if (event.keyCode === 13) {
            sendMessage()
        }
    })


    // Listen on new message
    socket.on('new_message', (data) => {
        var html = document.getElementById('chatroom').innerHTML
        html += `<p class='message'>${data.username}: ${data.message}</p>`
        document.getElementById('chatroom').innerHTML = html
    })
})()