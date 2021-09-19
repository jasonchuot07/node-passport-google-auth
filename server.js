const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const passportlocal = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const bodyParser = require('body-parser')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User = require('./Models/User.model')
const News = require('./Models/News.model')
const Project = require('./Models/Project.model')

// mongodbURI & frontEnd URI must be replaced
let mongodbURI = 'mongodb+srv://jasonchuot:13071999@cluster0.jvkzk.gcp.mongodb.net/jwt-mongodb?authSource=admin&replicaSet=atlas-v9uacy-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
let frontendURL = 'http://localhost:4000'
let backendURL = 'http://localhost:3001'

mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('Mongoose is running')
})

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: frontendURL,
    credentials: true
}))

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
}))

app.use(cookieParser('mtechcorp'))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    return cb(null, user)
})

passport.deserializeUser((user, cb) => {
    return cb(null, user)
})

passport.use(new GoogleStrategy({
    // ClientID & Client Secret must be replaced
    clientID:     '942535772131-mbgkg8bmdhkrta74fig1cbq8tb2dmslb.apps.googleusercontent.com', 
    clientSecret: 'PewQUsw7xW_3yf1iCTPXSzKC',
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, cb) {
    await User.findOne({googleId: profile.id}, async (err, doc) => {
        if (err) {
            console.log(err)
            cb(err, null)
        }
        if (!doc) {
            const new_User = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.email
            })
            await new_User.save()
            cb(null, new_User)
        }
        await cb(null, doc)

    })
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/login',
        successRedirect: frontendURL,
    }), (req, res) => {
        res.redirect(frontendURL)
    }
);

app.get('/get-active-user', (req, res) => {
    res.send(req.user)
})

app.post('/add-data', (req, res) => {
    const collectionName = req.body.dbname
    const newData = req.body.data

    if (collectionName === 'news') {
        const title = req.body.data.title
        const slug = req.body.data.slug
        const background = req.body.data.background
        const short = req.body.data.short
        const content = req.body.data.content
        const date = Date.parse(req.body.date)
        const newNews = new News({title, slug, background, content, short,createdAt: date})
        newNews.save()
        .then(()=> res.json('News added'))
        .catch(err => res.status(400).json('Error: ' + err))
    }

    if (collectionName === 'projects') {
        const name = req.body.data.name
        const slug = req.body.data.slug
        const background = req.body.data.background
        const company = req.body.data.company
        const companyDes = req.body.data.companyDes
        const productDes = req.body.data.productDes
        const date = Date.parse(req.body.date)
        const newProject = new Project({title, slug, background, content, short,createdAt: date})
        newProject.save()
        .then(()=> res.json('Project added'))
        .catch(err => res.status(400).json('Error: ' + err))
    }
})



app.delete('/delete-data', (req, res) => {
    const dbName = req.body.dbname
    const id = req.body.data._id
    const deleteItemByID = (db,id) => {
        db.findByIdAndDelete(id)
        .then(()=> res.json(`${db} deleted`))
        .catch(err => res.status(400).json('Error: ' + err))
    }
    if (dbName === 'news') {
        // News.findByIdAndDelete(id)
        // .then(()=> res.json('News deleted'))
        // .catch(err => res.status(400).json('Error: ' + err))
        deleteItemByID(News, id)
    }
    if (dbName === 'projects') {
        // Project.findByIdAndDelete(id)
        // .then(()=> res.json('Project deleted'))
        // .catch(err => res.status(400).json('Error: ' + err))
        deleteItemByID(Project, id)
    }
})

app.post('/update-data', (req, res) => {
    const updateBlackList = ['_id', 'createdAt', '__v']
    const dbName = req.body.dbname
    
    const updateByID = (db, id, data) => {
        db.findById(data._id).then(result => {
            const allKeys = Object.keys(result).filter(keys => !updateBlackList.includes(keys))
            allKeys.map((keys => {
                result[keys] = req.body.data[keys] ? req.body.data[keys] : result[keys]
            }))
        })
    }
    if (dbName === 'news') {
        updateByID(News, req.body.data._id, req.body.data)
    }
    if (dbName === 'projects') {
        updateByID(Project, req.body.data._id, req.body.data)
    }
})

app.get('/log-out', (req, res) => {
    if (req.user) {
        req.logout();
        res.send("done");
    }
})

app.listen(3001, () => {
    console.log(`Server started at ${backendURL}`)
})