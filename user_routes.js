const express = require('express');
// const app2 = express();

// const bodyParser = require('body-parser');
// app2.use(bodyParser.urlencoded({extended: true}));

// const cookieSession = require('cookie-session');
// app2.use(cookieSession({
//   name: 'session',
//   keys: ['PAOLO'],
//   maxAge: 24 * 60 * 60 * 1000,
// }));
const bcrypt = require('bcryptjs');

const { generateRandomString, urlsForUser, emailSearch } = require("./helpers");

//app2.set('view engine', 'ejs');

const urlDatabase = {};

const users = {};

userRouter = express.Router();

userRouter.get('/', (require, response) => {
  response.redirect('/urls');
});

userRouter.get('/login', (require, response) => {
  if (users[require.session.user_id]) {
    response.redirect('/urls');
  } else {
    const templateVars = {
      user: users[require.session.user_id]
    };
    response.render(`urls_login`, templateVars);
  }
});

userRouter.post('/login', (require, response) => {
  const userInfo = emailSearch(require.body.email, users);
  if (userInfo.email !== require.body.email) {
    response.status(403).send("Email does not exist");
  } else if (bcrypt.compareSync(require.body.password, userInfo.password) === false) {
    response.status(403).send("Invalid password");
  } else {
    require.session.user_id = userInfo.id;
    response.redirect(`/urls`);
  }
});

userRouter.post('/logout', (require, response) => {
  require.session = null;
  response.redirect(`/login`);
});

userRouter.get('/register', (require, response) => {
  if (users[require.session.user_id]) {
    response.redirect('/urls');
  } else {
    const templateVars = {
      user: users[require.session.user_id]
    };
    response.render('urls_register', templateVars);
  }
});

userRouter.post('/register', (require, response) => {
  if (require.body.email === '' || require.body.password === '') {
    response.status(400).send("Please fill out the email and password fields");
  } else if (emailSearch(require.body.email, users).email === require.body.email) {
    response.status(400).send("Email already exists");
  } else {
    const userID = generateRandomString(6);
    users[userID] = {
      id: userID,
      email: require.body.email,
      password: bcrypt.hashSync(require.body.password, 10)
    };
     console.log(users)
    require.session.user_id = userID;
    response.redirect(`/urls`);
  }
});

module.exports = {userRouter,users}
