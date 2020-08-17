// requited modules
var path = require('path')

// express
var express = require('express')
var app = express()

// parsers
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// logging
var logger = require('morgan')
app.use(logger('dev'))

// sass tanspiler
// var sass = require('node-sass-middleware')
// app.use(
//     sass({
//         src: __dirname + '/private/sass',
//         dest: __dirname + '/css',
//         debug: true
//     })
// )

// local folders
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(__dirname + '/private/uploads'))

// favicon
var favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// cookies
var cookieParser = require('cookie-parser')
app.use(cookieParser())
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'the winter is coming',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// redirect dependencies
// app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
// app.use('/popper.js', express.static(__dirname + '/node_modules/popper.js/dist'))
app.use('/bcryptjs', express.static(__dirname + '/node_modules/bcryptjs/dist'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/moment', express.static(__dirname + '/node_modules/moment/min'))
// app.use('/selectize', express.static(__dirname + '/node_modules/selectize/dist'))
app.use('/material', express.static(__dirname + '/node_modules/material-design-lite/dist'))
app.use('/materialicons', express.static(__dirname + '/node_modules/material-design-icons/dist'))
app.use('/daterangepicker', express.static(__dirname + '/node_modules/daterangepicker'))
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'))
app.use('/fonts', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/webfonts'))
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'))
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'))
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet-search/dist'))

// redirect local pages
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
app.use('/', indexRouter)
app.use('/users', usersRouter)

// locals
app.use(function (req, res, next) {
    // res.locals.API = process.env.GOOGLE_API
    res.locals.user_id = req.session.user_id
    next()
})

// catch 404 and forward to error handler
var createError = require('http-errors')
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// module exports
module.exports = app
