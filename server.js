var app = require('./app.js')

var server = app.listen(config.app.port, () => {
    console.log(`Node chat server is running on port: ${config.app.port}`)
})

module.exports = server