let Festival = require('../models/festivals')
let Post = require('../models/post')
let maths = require('../public/js/helpers')
var crypto = require('crypto')
var fs = require('fs-extra')
var debug = require('debug')('wired:festivals')

//----------------------------------------------------- GET

// exports.prepare = function (view, req, res, extra_dict) {
//     try {
//         Post.find(function (err, posts) {
//             if (err)
//                 res.status(500).send('Invalid data!')
//             return_dict = Object.assign({}, { posts_arr: posts }, extra_dict || {});
//             debug(return_dict)
//             res.render(view, return_dict);
//         });
//     } catch (e) {
//         res.status(500).send('error ' + e)
//     }
// }

//----------------------------------------------------- POST

exports.insert = function (res, req) {
    res.send('insert posts')
}

exports.getAllPosts = function (req, res) {
    try {
        Post.find(function (err, posts) {
            if (err)
                res.status(500).send('Invalid data!')
            res.setHeader('Content-Type', 'application/json')
            // post = JSON.stringify(posts)
            res.status(200).send({ success: true, posts: posts })
        });
    } catch (e) {
        res.status(500).send('error ' + e)
    }
}


exports.getUserPosts = function (req, res) {
    var userData = req.body;
    debug(userData)
    // debug(userData.author)
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Post.find({ author: userData.author.trim().toLowerCase(), email: userData.email.trim().toLowerCase() },
            function (err, posts) {
                //  debug(posts)
                if (err)
                    res.status(500).send('Invalid data!')
                if (posts.length > 0) {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(200).send({ success: true, posts: posts })
                } else {
                    res.status(200).send({ success: true, posts: "You have no posts!" })
                }
            });
    } catch (e) {
        res.status(500).send('error ' + e)
    }
}
