const mongoose = require('mongoose')

var MemberSchema = mongoose.Schema({
    fullName: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    }
})

MemberSchema.statics.logUserIn = function (user, callback) {
    let {userName, password} = user
    this.findOne({userName: userName}, (err, member) => {
        if (err) {
            return callback(err)
        }
        if (member === null) {
            return this.create(user, (err, data) => {
                if (err) {
                    return callback(err)
                }
                return callback(null, data)
            })
        }
        if (member.password === password) {
            return callback(null, member)
        }
        return callback('Username is existed and password was not matched.')
    })
}

mongoose.model('Member', MemberSchema)
module.exports = mongoose.model('Member')