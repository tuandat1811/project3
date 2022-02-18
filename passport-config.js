const { authenticate } = require('passport')
const bcrypt = require('bcrypt');

const LocalTratgy = require('passport-local').Strategy

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async(username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null) {
            return done(null, false, {message: 'No user'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Wrong password'})
            } 
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalTratgy({usernameField: 'username'},
    authenticateUser))
    passport.serializeUser((user, done) => done (null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize