var express = require('express')
var app = express()

require('./config/config.js')
require('./db.js')

// set the template engine
app.set('view engine', 'ejs')

// Middlewares
app.use((req, res, next) => {
    console.log(`Link ${req.url} || Method: ${req.method}`)
    next()
})
app.use(express.static('public'))

app.get('/', (req, res) => {
    return res.render('index')
})
module.exports = app