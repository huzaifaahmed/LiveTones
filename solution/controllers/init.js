var debug = require('debug')('wired:mongoinit')
var Festival = require('../models/festivals')
var Genre = require('../models/genre')
var Post = require('../models/post')
var User = require('../models/user')

exports.init = function () {

    // uncomment if you need to drop the database

    // Festival.remove({}, function(err) {
        //    debug('collection removed')
        // })

    var bcrypt = require('bcryptjs')
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync('admin', salt)
    var d = new Date(2018, 11, 24, 10, 33, 30, 0)

    var user = new User({
        email: 'admin@admin.com',
        name: 'admin',
        date: d,
        pswd: hash
    })

    user.save(function (err, results) {
        debug("user_id: " + results._id)
    })

    var genres = [
        new Genre({ name: 'Ambient' }),
        new Genre({ name: 'Blues' }),
        new Genre({ name: 'Classical ' }),
        new Genre({ name: 'Country' }),
        new Genre({ name: 'Electronic' }),
        new Genre({ name: 'Folk' }),
        new Genre({ name: 'Hip-hop' }),
        new Genre({ name: 'House' }),
        new Genre({ name: 'Jazz' }),
        new Genre({ name: 'Pop' }),
        new Genre({ name: 'Progressive' }),
        new Genre({ name: 'Psychedelic' }),
        new Genre({ name: 'R&B' }),
        new Genre({ name: 'Reggae' }),
        new Genre({ name: 'Rock' })]

    genres.forEach(function (genre) {
        genre.save(function (err, results) {
            debug(results.name + ": " + results._id)
        })
    })

    var festival1 = new Festival({
        name: 'Westlife',
        genre: [genres[9]._id, genres[12]._id],
        description: 'Nope',
        date: d,
        address: "Broughton Ln, Sheffield S9 2DF",
        location: {
            lat: 53.39912,
            lng: -1.41942
        },
        image: 'fb5d9896f1aec89f7130c4b42dc0752b1527140159174.jpg'
    })

    festival1.save(function (err, results) {
        debug("festival1_id: " + results._id)
    })

    var post_festival1 = new Post({
        author: 'Tim',
        email: 'test1@admin.com',
        festival: festival1._id,
        date: d,
        image: 'main-image.jpg',
        comment: "The best band ever!"
    })

    post_festival1.save(function (err, results) {
        debug("post_festival1_id: " + results._id)
    })

    var post2_festival1 = new Post({
        author: 'George',
        email: 'test2@admin.com',
        festival: festival1._id,
        date: d,
        image: 'main-image.jpg',
        comment: "Ehh. Expected better :("
    })

    post2_festival1.save(function (err, results) {
        debug("post2_festival1_id: " + results._id)
    })

    var post3_festival1 = new Post({
        author: 'admin',
        email: 'admin@admin.com',
        festival: festival1._id,
        date: d,
        image: 'main-image.jpg',
        comment: "Aw......"
    })

    post3_festival1.save(function (err, results) {
        debug("post3_festival1_id: " + results._id)
    })
}
