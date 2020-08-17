var debug = require('debug')('wired:mongo')
var mongoose = require('mongoose')

// connect to mongodb
var url = 'mongodb://localhost:27017/festivals'

// allow multiple connections
try {
    mongoose.Promise = global.Promise
    mongoose.connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true
    })
    var db = mongoose.connection
    // db.dropDatabase()
    debug("connection to mongodb successful!")
    debug("mongodb server at: " + url)

    // To Count Documents of a particular collection
    db.collection('users').countDocuments(function (err, count) {
        debug(err)
        debug(count)

        if (count == 0) {
            debug("No Found Records.")
            debug("Initializing Database")
            var initDB = require('../controllers/init')
            initDB.init()
        }
        else {
            debug("Found Records : " + count)
        }
    })
} catch (e) {
    debug('error in db connection: ' + e.message)
}
