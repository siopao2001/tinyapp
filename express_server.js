const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['PAOLO'],
  maxAge: 24 * 60 * 60 * 1000,
}));
const bcrypt = require('bcryptjs');

//const { generateRandomString, urlsForUser, emailSearch } = require("./helpers");

const {userRouter} = require('./user_routes.js');
const {urlRouter} = require('./url_routes.js');
const u_routes = require('./u_routes.js');

app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  if (!req.user) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
  }
  next();
});



// const urlDatabase = {};

// const users = {};

app.use('/', userRouter);
app.use('/urls', urlRouter);
app.use('/u', u_routes);

// app.get('/', (require, response) => {
//   response.redirect('/urls');
// });

// app.get('/login', (require, response) => {
//   if (users[require.session.user_id]) {
//     response.redirect('/urls');
//   } else {
//     const templateVars = {
//       user: users[require.session.user_id]
//     };
//     response.render(`urls_login`, templateVars);
//   }
// });

// app.post('/login', (require, response) => {
//   const userInfo = emailSearch(require.body.email, users);
//   if (userInfo.email !== require.body.email) {
//     response.status(403).send("Email does not exist");
//   } else if (bcrypt.compareSync(require.body.password, userInfo.password) === false) {
//     response.status(403).send("Invalid password");
//   } else {
//     require.session.user_id = userInfo.id;
//     response.redirect(`/urls`);
//   }
// });

// app.post('/logout', (require, response) => {
//   require.session = null;
//   response.redirect(`/login`);
// });

// app.get('/register', (require, response) => {
//   if (users[require.session.user_id]) {
//     response.redirect('/urls');
//   } else {
//     const templateVars = {
//       user: users[require.session.user_id]
//     };
//     response.render('urls_register', templateVars);
//   }
// });

// app.post('/register', (require, response) => {
//   if (require.body.email === '' || require.body.password === '') {
//     response.status(400).send("Please fill out the email and password fields");
//   } else if (emailSearch(require.body.email, users).email === require.body.email) {
//     response.status(400).send("Email already exists");
//   } else {
//     const userID = generateRandomString(6);
//     users[userID] = {
//       id: userID,
//       email: require.body.email,
//       password: bcrypt.hashSync(require.body.password, 10)
//     };
//     require.session.user_id = userID;
//     response.redirect(`/urls`);
//   }
// });

// ///////////////////////////////////////////////////

// app.get('/urls', (require, response) => {
//   if (!users[require.session.user_id]) {
//     response.send("Please log in or register");
//   } else {
//     const templateVars = {
//       urls: urlsForUser(require.session.user_id, urlDatabase),
//       user: users[require.session.user_id]
//     };
//     response.render('urls_index', templateVars);
//   }
// });

// app.get('/urls/new', (require, response) => {
//   if (!users[require.session.user_id]) {
//     response.redirect('/login');
//   } else {
//     const templateVars = {
//       user: users[require.session.user_id]
//     };
//     response.render('urls_new', templateVars);
//   }
// });

// app.post('/urls', (require, response) => {
//   if (!users[require.session.user_id]) {
//     response.status(401).send("Please log in or register");
//   } else {
//      const randomString = generateRandomString(6);
//   urlDatabase[randomString] = {
//     longURL: require.body.longURL,
//     userID: users[require.session.user_id].id 
//   };
//   response.redirect(`/urls/${randomString}`);
//  }
// });

// app.post('/urls/:id', (require, response) => {
//   if (!users[require.session.user_id] || urlDatabase[require.params.id].userID !== users[require.session.user_id].id) {
//     response.status(401).send("Please login as the appropriate user");
//   } else {
//     const sID = require.params.id;
//     urlDatabase[sID].longURL = require.body.newURL;
//     response.redirect(`/urls`);
//   }
// });

// app.post('/urls/:shortURL/delete', (require, response) => {
//   if (!users[require.session.user_id] || urlDatabase[require.params.shortURL].userID !== users[require.session.user_id].id) {
//     response.status(401).send("Please login as the appropriate user");
//   } else {
//     const shURL = require.params.shortURL;
//     delete urlDatabase[shURL];
//     response.redirect(`/urls`);
//   }
// });

// app.get("/urls/:shortURL", (req, res) => {
//   if (!urlDatabase[req.params.shortURL]) {
//     res.status(404).send("This short URL has not been set");
//   } else if (!users[req.session.user_id] || urlDatabase[req.params.shortURL].userID !== users[req.session.user_id].id) {
//     res.status(401).send("Please login as the appropriate user");
//   } else {
//     const templateVars = {
//       shortURL: req.params.shortURL,
//       longURL: urlDatabase[req.params.shortURL].longURL,
//       user: users[req.session.user_id]
//     };
//     res.render("urls_show", templateVars);
//   }
// });

// app.get("/u/:shortURL", (req, res) => {
//   if (!urlDatabase[req.params.shortURL]) {
//     res.status(404).send("This short URL has not been set");
//   } else {
//     const longURL = urlDatabase[req.params.shortURL].longURL;
//     res.redirect(longURL);
//   }
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
