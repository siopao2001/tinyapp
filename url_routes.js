const express = require('express');
const {users} = require('./user_routes.js');
// const app3 = express();

// const bodyParser = require('body-parser');
// app3.use(bodyParser.urlencoded({extended: true}));

// const cookieSession = require('cookie-session');
// app3.use(cookieSession({
//   name: 'session',
//   keys: ['PAOLO'],
//   maxAge: 24 * 60 * 60 * 1000,
// }));
const bcrypt = require('bcryptjs');

const { generateRandomString, urlsForUser, emailSearch } = require("./helpers");

//app3.set('view engine', 'ejs');

const urlDatabase = {};

//const users = {};

urlRouter = express.Router();

urlRouter.get('/', (require, response) => {
  if (!users[require.session.user_id]) {
    response.send("Please log in or register");
  } else {
    const templateVars = {
      urls: urlsForUser(require.session.user_id, urlDatabase),
      user: users[require.session.user_id]
    };
    response.render('urls_index', templateVars);
  }
});

urlRouter.get('/new', (require, response) => {
  if (!users[require.session.user_id]) {
    response.redirect('/login');
  } else {
    const templateVars = {
      user: users[require.session.user_id]
    };
    response.render('urls_new', templateVars);
  }
});

urlRouter.post('/', (require, response) => {
  if (!users[require.session.user_id]) {
    response.status(401).send("Please log in or register");
  } else {
     const randomString = generateRandomString(6);
  urlDatabase[randomString] = {
    longURL: require.body.longURL,
    userID: users[require.session.user_id].id 
  };
  response.redirect(`/urls/${randomString}`);
 }
});

urlRouter.post('/:id', (require, response) => {
  if (!users[require.session.user_id] || urlDatabase[require.params.id].userID !== users[require.session.user_id].id) {
    response.status(401).send("Please login as the appropriate user");
  } else {
    const sID = require.params.id;
    urlDatabase[sID].longURL = require.body.newURL;
    response.redirect(`/urls`);
  }
});

urlRouter.post('/:shortURL/delete', (require, response) => {
  if (!users[require.session.user_id] || urlDatabase[require.params.shortURL].userID !== users[require.session.user_id].id) {
    response.status(401).send("Please login as the appropriate user");
  } else {
    const shURL = require.params.shortURL;
    delete urlDatabase[shURL];
    response.redirect(`/urls`);
  }
});

urlRouter.get("/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("This short URL has not been set");
  } else if (!users[req.session.user_id] || urlDatabase[req.params.shortURL].userID !== users[req.session.user_id].id) {
    res.status(401).send("Please login as the appropriate user");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  }
});

module.exports = {urlRouter, urlDatabase}