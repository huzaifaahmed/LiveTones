var express = require('express')
var debug = require('debug')('wired:routes')
var router = express.Router()
var festivals = require('../controllers/festivals')
var user = require('../controllers/users')
var fs = require('fs-extra')

/* GET home page.*/
router.get('/', function (req, res, next) {
    debug('user_id: %s', req.session.user_id)
    if (req.session.user_id !== undefined) {
        process.env.LOGIN = ''
        user.get_user(req, res)
    } else {
        process.env.LOGIN = '/login'
        res.redirect('/users/login')
    }
})

/* GET feed page */
router.get('/feed', function (req, res, next) {
    user.checkAuth(req, res)
    // festivals.getAllPosts
    res.render('feed', { page: req.url })
    // festivals.prepare('feed', req, res, { page: req.url });
})

// router.post('/feed', festivals.getAllPosts)

/* GET account page */
router.get('/account', function (req, res, next) {
    user.checkAuth(req, res)
    res.render('account', { page: req.url })
})


router.post('/account',
    function (req, res, next) {
        // body = JSON.stringify(req.body)
        // debug('data body1: %s', req.body.email)
        if (req.body.email == undefined) {
            user.get_date(req, res, next)
        } else {
            festivals.getUserPosts(req, res, next)
        }
    }
)

/* GET events listing. */
// router.get('/events', function (req, res, next) {
//     user.checkAuth(req, res)
//     var api_key = process.env.GOOGLE_MAPS_API
//     var gmaps = 'https://maps.googleapis.com/maps/api/js?key=' + api_key + '&callback=initMap'
//     res.render('events', { title: 'Events page', gmaps: gmaps })
// })

/* GET cam listing. -Prototype for Cam- */
router.get('/cam', function (req, res, next) {
    // user.checkAuth(req, res)
    res.render('cam', {
        title: 'Camera page', camera_button: 'Open camera',
        capture_button: 'Capture', send_button: 'Upload image'
    })
})

/* GET cam listing. -Prototype for Cam- */
router.post('/cam', function (req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    } else if (!isNumeric(userData.year)) {
        res.status(403).send('Year is invalid!')
    }
    const year = (new Date()).getFullYear();
    userData.age = year - parseInt(userData.year);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));

    // try {
    //     if (!req.files) {
    //         res.send({
    //             status: false,
    //             message: 'No file uploaded'
    //         });
    //     } else {
    //         //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    //         let avatar = req.files.avatar;

    //         //Use the mv() method to place the file in upload directory (i.e. "uploads")
    //         avatar.mv('./uploads/' + avatar.name);

    //         //send response
    //         res.send({
    //             status: true,
    //             message: 'File is uploaded',
    //             data: {
    //                 name: avatar.name,
    //                 mimetype: avatar.mimetype,
    //                 size: avatar.size
    //             }
    //         });
    //     }
    // } catch (err) {
    //     res.status(500).send(err);
    // }

    // try {
    //     // to declare some path to store your converted image
    //     const path = './images/' + Date.now() + '.png'

    //     // const imgdata = req.body.base64image;
    //     const imgdata = req.body.data;

    //     // to convert base64 format into random filename
    //     const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    //     fs.writeFileSync(path, base64Data, { encoding: 'base64' });

    //     return res.send(path);

    // } catch (e) {
    //     next(e);
    // }
}
)

router.get('/createevent', function(req, res, next) {
    user.checkAuth(req, res)
    res.render('createevent', { page: req.url })
});

router.get('/createpost', function(req, res, next) {
    user.checkAuth(req, res)
    res.render('createpost', { page: req.url })
});

module.exports = router
