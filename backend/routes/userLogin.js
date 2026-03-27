const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = new Router();
const passport = require('passport');
const localStrategy = require('../strategies/local-strategy')
const { encryptEmail, decryptEmail } = require('./assets/encryptDecryptData');
const generateSHA256Hash = require('./assets/generateSHA256Hash');
const { Sequelize } = require('sequelize');
const usersTable = require('../models/index.js').User;
const {body, validationResult }= require('express-validator');

router.post('/login', passport.authenticate("local"), (req,res) => {
    console.log("HEY!");
    if(req.body.keepSession) req.session.cookie.maxAge = 7*24*60*60*1000;
    else req.session.cookie.maxAge = false;
    return res.json({success: true});
})

router.post('/signup', [
    body('email').not().isEmpty().withMessage("Email required"),
    body('email').trim().isEmail().escape(),
    body('password').not().isEmpty().withMessage('Password required'),
    body('password').isLength({min:8}).escape(),
    body('username').not().isEmpty().withMessage("Username required"),
    body('username').notEmpty().escape()
], async (req, res) => {

    //console.log(req.body);

    const errors =(validationResult(req))

    if(!errors.errors.length){
        const email = req.body.email;

        const {username, password} = req.body;
        const {datum, iv,authTag} = encryptEmail(email);
        const emailHash = generateSHA256Hash(email)

        bcrypt.hash(password, 12, async (err,hash) => {
            try {
                const user = await usersTable.create({
                    username: username,
                    email: datum,
                    emailHash: emailHash,
                    emailIv: iv,
                    emailAuthTag: authTag,
                    password: hash
                })
                console.log("Usuário criado!");
                req.login(user, err => {
                    if(err) throw err;
                    req.session.cookie.maxAge = false;
                    res.status(201).json({success: true});
                })
            } catch(err){
                const errMessage = err.errors[0].message;
                if(errMessage.includes("email")){
                    res.status(409).json({error: {
                        type: "email",
                        message: "Email already in use",
                    }});
                } else if(errMessage.includes("username")){
                    res.status(409).json({error: {
                        type: "username",
                        message: "Username already in use",
                    }});
                }
            }
        })
    } else {
        res.status(409);
    }

})

router.post('/logout', async (req,res,next) =>  {
    req.session.destroy( err => {
        if(err) { return next(err); }
    })
    req.session = null;
    res.clearCookie('cookieMonster')
    res.send('Ok');
})

router.get('/login/checkAuth', (req,res) => {
    const isAuthenticated = typeof req.user !== 'undefined';
    let username = undefined;
    if(req.user !== undefined){
        username = req.user[0].username;
    }
    res.status(200).json({
        authenticated: isAuthenticated,
        username: username
    });
})

/*

router.get('/login/testing', async (req,res) => {
    const users = await usersTable.findAll();
    res.json(users);
})

router.get('/login/delete', async (req,res) => {
    try{
        await Sequelize.destroyAll();
    } catch(err){
        console.log(err)
    }
    res.json({
        ans: "done"
    })
})
*/

module.exports = router;