var mongoose = require('mongoose')

var { host, username, password, database, uriOptions } = config.db

const uri = `mongodb+srv://${host}/${database}?${uriOptions}`
const connOptions = {
    useNewUrlParser: true,
    user: username,
    pass: password
}

var sussess = () => {console.log(`[SUCCEED][${__filename}] Time: ${new Date()}`)} // promise resolves to undefined
var fail = (err) => {console.log(`[FAILED][${__filename}] Time: ${new Date} || error: ${err}`)}

mongoose.connect(uri, connOptions).then(sussess).catch(fail)

module.exports = mongoose.connection