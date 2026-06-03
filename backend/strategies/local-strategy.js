const passport = require('passport');
const { Strategy } = require( 'passport-local');
const usersTable = require('../models/index.js').User;
const bcrypt = require('bcrypt');
const generateSHA256Hash = require('../routes/assets/generateSHA256Hash.js');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await usersTable.findAll({
        where: {
            id: id
        }
    })
    done(null, user);
});

module.exports = passport.use(
    new Strategy( async (userEmail, password, done) => {

        console.log(userEmail);

        const userEmailHashed = generateSHA256Hash(userEmail);

        const user = await usersTable.findOne({
            where: {
                emailHash: userEmailHashed,
            }
        })

        if(user === null) {
            return done(null,false, {message: "email not registered"});
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) return done(err);
                if(result){
                    return done(null, user);
                } else {
                    return done(null, false, {message: "invalid credentials"});
                }
            })
        }
 
    })
)