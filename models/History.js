const mongoose = require('mongoose')

var HistorySchema = mongoose.Schema({
    createdTime: {
        type: Number
    },
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'Member'
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'Member'
    },
    content: {
        type: String
    },
    deleteFlag: {
        type: String
    }
})

mongoose.model('History', HistorySchema)
module.exports = mongoose.model('History')