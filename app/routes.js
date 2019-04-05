 module.exports = function(app, passport, db, io) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    function getNewsArticles(req, res){
      return new Promise((resolve, reject) => {
        db.collection('newsArticles').find().toArray((err, result) => {
          if (err) reject({error: err})
          resolve({user: req.user , newsArticles: result})
        })
      })
    }
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        getNewsArticles(req, res).then( (result) => {
          if (result.error) {
            return console.log(result.error);
          }
          res.render('profile.ejs', {
            user : result.user,
            newsArticles: result.newsArticles
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      console.log(req.body)
      console.log(req.body.msg)
      db.collection('newsArticles').save({msg: req.body.msg}, (err, result) => {
      //  console.log(req.body)
        if (err) return console.log(err)
        getNewsArticles(req, res).then( (result) => {
          console.log("get news articles")
          let data = result.newsArticles
          io.emit("update news", data[data.length-1]);
        })
        // res.redirect('/profile')
        console.log('saved to database')
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('newsArticles')
      .findOneAndUpdate({msg: req.body.msg}, {
        $set: {
          star:req.body.star + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('newsArticles').findOneAndDelete({msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
