const express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github2'),
    path = require('path'),
    config = require('./.config'),
    port = 3000,
    axios = require('axios'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(session({
    secret: 'ponies'
}));
app.use(passport.initialize())
app.use(passport.session());
app.use('/', express.static(path.join(__dirname, '../public')));

passport.serializeUser(function(user, done) {
    done(null, user._json);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }
));

app.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    }),
    function(req, res) {
        //stuff
    });

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/api/github/following', ensureAuthenticated, function(req, res) {
        axios.get(req.user.followers_url).then(function(followers) {
            return res.status(200).json(followers.data);
        })
})

app.get('/api/github/:username/activity', ensureAuthenticated, function(req, res) {
        axios.get(`https://api.github.com/users/${req.params.username}/events`).then(function(events) {
            return res.status(200).json(events.data);
        })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403)
}


app.listen(port, () => console.log(`listening on port ${port}`));