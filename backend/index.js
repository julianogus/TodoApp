const express = require("express");
const cors = require("cors");
const app = express();
const todoRouter = require("./routes/todos");
const loginRouter = require("./routes/userLogin");
const session = require("express-session");
const passport = require('passport');

// Authentication
app.use(session({
    name: 'cookieMonster',
    secret: `${crypto.randomUUID()}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/api', todoRouter)
app.use('', loginRouter)

app.get('/', (req,res) => {
    console.log("HEY!");
    res.status(200).send('Ok');
})

const PORT = 3000;

app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log("Listening on port ", PORT);
})