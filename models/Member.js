const mongoose = require('mongoose')

var MemberSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true
    },
    usename: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model('Member', MemberSchema)
module.exports =mongoose.model('Member')