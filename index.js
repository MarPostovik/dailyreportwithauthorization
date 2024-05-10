const express = require('express');
const axios = require('axios');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const app = express();
const port = 3000;

// Генерування випадкового секрету для сесії
const sessionSecret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify']
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
// Налаштування шаблонізатора EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
};

app.get('/employees.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', 'employees.json'));
});
app.get('/webhookURLs.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', 'webhookURLs.json'));
});

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        const contentType = mimeTypes[path.extname(filePath)];
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
    },
}));
app.get('/', (req, res) => {
    res.render('home');
    // res.send('Для авторизації перейдіть за <a href="/auth/discord">посиланням</a>');
});
// Роут для авторизації Discord
app.get('/auth/discord', passport.authenticate('discord'));


// Роут для обробки колбеку після авторизації
app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/index'); // Перенаправлення на index.html після успішної авторизації
    }
);


// Рендерінг сторінки index.html та передача даних про користувача на сторінку
app.get('/index', (req, res) => {
    // Перевірка чи користувач авторизований
    if (!req.isAuthenticated()) {
        res.redirect('/'); // Перенаправлення на головну сторінку, якщо користувач не авторизований
    } else {
        // Рендерінг сторінки index.html та передача даних про користувача на сторінку
        res.render('index', { user: req.user });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущено`);
});
