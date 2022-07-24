const express = require('express');
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {v4} = require('uuid')
const app = express()


let storage = []

app.use(session({
    secret: 'KLJ2L3L2',
    resave: false,
    saveUninitialized: false,
}))
app.use(express.urlencoded());
app.use(express.json())

app.use(passport.initialize())
passport.use(new LocalStrategy( (username, password, done) => {
    findByUsername(username, (err, user) => {
        if(err) return done(err)
        if(!user) return done(null, false)
        const compared = bcrypt.compare(password, user.password)
        if(!compared) return done(null, false)
        done(null, user)
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    findById(id, (err, user) => {
        if(err) return done(err)
        done(null, user)
    })
})

function findById(id, callback) {
    const users = storage.filter(user => user.id === id)
    if(users) {
        callback(null, users[0])
    } else {
        callback(new Error('User not found'), null)
    }
}

function findByUsername(username, callback) {
    const users = storage.filter(user => user.username === username)
    if(users) {
        callback(null, users[0])
    } else {
        callback(new Error('User not found'), null)
    }
}

function generateId() {
    return v4() + ''
}

function createUser(user) {
    return new Promise((resolve, reject) => {
        const newUser = {
            id: generateId(),
            ...user 
        }
        storage = [newUser, ...storage]
        resolve(newUser)
    })
}


app.post('/login', passport.authenticate('local', {failureMessage: 'something went wrong'}), (req, res) => {
    res.json({
        msg: 'logged in!'
    })
})

app.post('/register', async(req, res) => {
    const {username, password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password, salt)
    const newUser = await createUser({username, password: hashPass});
    if(newUser) {
        console.log(storage)
        res.status(201).json({
            msg: "register successful",
            newUser
        })
    } else {
        res.status(500).json({
            msg: "something went wrong"
        })
    }
})

app.get('/profile', (req, res) => {
    const id = req.user.id
    res.send(id)
})

app.get('/logout', (req, res) => {
    req.logout()
})
app.post('/testing', (req, res, next) => {
    const {password, username} = req.body;
    console.log(password, username)
    res.send({password: password, username: username})
})


app.listen(6969, () => {
    console.log('running')
})