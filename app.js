const express = require('express')
const app = express()

const port = 1234



// ejs code 
app.set('view engine', 'ejs')


// css link
app.use(express.static('public'))




// connect data base
const connectDbs = require('./DB/connectDb')

// connectdb function connectDbs
connectDbs()

// convert language for database
app.use(express.urlencoded({ extended: false }))


// connect flash and session 
const session = require('express-session')
const flash = require('connect-flash')

// message

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));

// flash message
app.use(flash())

const cookieParse = require('cookie-parser')

// token gET
app.use(cookieParse());

// fileuploader for image
const fileuploader = require('express-fileupload')

// call function of fileuploader
app.use(fileuploader({useTempFiles: true}))




// always on last
const web = require('./route/web')
app.use('/', web)





app.listen(port, () => { console.log('Localhost:1234') });