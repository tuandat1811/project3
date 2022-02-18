if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//import variable
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(
  passport, 
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)
//connect to SINNO Server
mongoose.connect('mongodb://tuandat:tuandat@sinno.soict.ai:27017/tuandat', {
  useNewUrlParser: true, useUnifiedTopology: true
})

const users = []

//include css in ejs
app.use('/assets', express.static('assets'));

//set view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index.ejs', { shortUrls: shortUrls })
})
app.get('/home', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index.ejs', { shortUrls: shortUrls })
})

//root
app.get('/login', (req, res) => {
  res.render('login.ejs')
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', (req, res) => {
  res.render('register.ejs')
})
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      confirmpass: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

function checkAuthenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(process.env.PORT || 80);