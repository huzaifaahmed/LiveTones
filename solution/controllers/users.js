var bcrypt = require('bcryptjs')
var User = require('../models/user')
var debug = require('debug')('wired:users')
var dateFormat = require('dateformat')
let Post = require('../models/post')
let Festival = require('../models/festivals')

exports.checkAuth = function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/users/login/')
        return
    }
}

exports.logout = function (req, res) {
    if (req.session.user_id !== undefined) {
        req.session.destroy()
        res.send({ success: true })
    } else {
        res.send({ success: false })
    }
}

exports.login = function (req, res) {
    var email = req.body.email
    var name = req.body.name
    var pswd = req.body.pswd

    if (!name) {
        debug('received email: ' + email)
        debug('received password: ' + pswd)
        User.find({ email: email }).exec(function (err, users) {
            if (err) {
                res.send({ msg: "Failed to Login" })
            }
            if (users.length == 1 && users[0].pswd) {
                debug(users)
                var isCorrect = bcrypt.compareSync(pswd, users[0].pswd)
                debug(isCorrect)
                if (isCorrect) {
                    req.session.user_id = users[0]._id
                    res.status(200).send({ succeed: true })
                } else {
                    res.status(200).send({ failed: true })
                }
            } else {
                res.status(200).send({ failed: true, msg: "Failed to Login" })
            }
        })
    } else {
        debug('received email: ' + email)
        debug('received name: ' + name)
        debug('received password: ' + pswd)
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(pswd, salt)
        User.find({ email: email }).exec(function (err, users) {
            debug('received: ' + users)
            if (err) { throw err }
            if (users.length >= 1) {
                res.send({ success: false })
                return
            } else {
                user = new User({
                    'email': email,
                    'name': name,
                    'pswd': hash
                })
                debug('received: ' + user)
                user.save().then(function (user_result) {
                    req.session.user_id = user_result._id
                    res.status(200).send({ success: true })
                })
            }
        })
    }
}

exports.all_posts = function() {
    Post.find(function (err, posts) {
        if (err)
            res.status(500).send('Invalid data!')
        p = posts
    })
    return p
}

exports.all_festivals = function() {
    Festival.find(function (err, festivals) {
        if (err)
            res.status(500).send('Invalid data!')
        s  =  festivals
    })
    return s
}

exports.get_user = function (req, res) {
    var validUser = new Promise((resolve, reject) => {
        User.findOne({ _id: req.session.user_id }).exec(function (err, str) {
            if (err) {
                var reason = new Error('User is not registered')
                reject(reason)
            } else {
                resolve(str.name)
                process.env.USERNAME = str.name
                process.env.EMAIL = str.email
                debug("success")
            }
        })
    })

    var posts  = exports.all_posts()
    debug(posts)
    var festivals  = exports.all_festivals()
    debug(festivals)

    var userValidated = function () {
        validUser.then(function (fulfilled) {
            debug(fulfilled)
            debug("redirecting")
            res.render('index', {
                title: 'Home',
                name: fulfilled,
                page: req.url,
                posts: posts,
                festivals: festivals
            })
        }).catch(function (error) {
            debug(error)
        })
    }

    userValidated()
}

exports.get_date = function (req,res,next) {
    debug('email got here: %s', process.env.EMAIL)
    try {
        User.findOne({ email: process.env.EMAIL }, 'date',
            function (err, emails) {
                debug('email found: %s', emails)
                if (err)
                    res.status(500).send('Invalid data!')
                date = dateFormat(emails.date, "fullDate")
                res.setHeader('Content-Type', 'text/json')
                res.status(200).send({ success: true, date: date })
            })
    } catch (e) {
        res.status(500).send('error ' + e)
    }
}
