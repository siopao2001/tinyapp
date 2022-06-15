const express = require('express');
const {urlDatabase} = require('./url_routes.js');
// const app4 = express();

// const bodyParser = require('body-parser');
// app4.use(bodyParser.urlencoded({extended: true}));

// const cookieSession = require('cookie-session');
// app4.use(cookieSession({
//   name: 'session',
//   keys: ['PAOLO'],
//   maxAge: 24 * 60 * 60 * 1000,
// }));
const bcrypt = require('bcryptjs');

const { generateRandomString, urlsForUser, emailSearch } = require("./helpers");

//app4.set('view engine', 'ejs');

//const urlDatabase = {};

//const users = {};

u_Router = express.Router();

u_Router.get("/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("This short URL has not been set");
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

module.exports = u_Router;
