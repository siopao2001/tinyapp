const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

function generateRandomString(len) {
  var ans = '';
  const array = 'abcdefghijklmnopqrstuvwxyz123456789123456789';
  for (var i = len; i > 0; i--) {
    ans +=
      array[Math.floor(Math.random() * array.length)];
  }
  return ans;
};

function emailSearch(userEmail) {
  for (item in users) {
    if (users[item].email === userEmail) {
      return true
    }
  }
  return false
};

app.set('view engine', 'ejs')

const urlDatabase =  {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {}

app.get('/', (require, response)=>{
   response.send('Hello!');
});

app.get('/login', (require, response)=>{
  const templateVars = {user: users[require.cookies["user_id"]]}
  response.render('urls_login', templateVars);
})


app.post('/login', (require, response)=>{
   response.cookie('username', require.body.username)
   response.redirect(`/urls`)
})

app.post('/logout', (require, response)=>{
   response.clearCookie('user_id')
   response.redirect(`/urls`)
})

app.get('/register', (require, response)=>{
   const templateVars = {user: users[require.cookies["user_id"]]}
   response.render('urls_register', templateVars);
})

app.post('/register', (require, response) => {
  if (require.body.email === '' || require.body.password === '') {
    response.status(400).send("Please fill out the email and password fields")
  } else if (emailSearch(require.body.email) === true) {
    response.status(400).send("Email already exists")
  } else {
    const userID = generateRandomString(6)
    users[userID] = {
      id: userID,
      email: require.body.email,
      password: require.body.password
    }
    response.cookie('user_id', userID)
    response.redirect(`/urls`)
  }
})

app.get('/urls', (require, response)=>{
   const templateVars = {urls: urlDatabase, user: users[require.cookies["user_id"]]}
   response.render('urls_index', templateVars);
})

app.get('/urls/new',(require, response)=>{
   const templateVars = {user: users[require.cookies["user_id"]]}
   response.render('urls_new', templateVars)
})

app.post('/urls', (require, response)=>{
   const randomString = generateRandomString(6)
   urlDatabase[randomString] = require.body.longURL
   response.redirect(`/urls/${randomString}`)
})

app.post('/urls/:id', (require, response)=>{
   const sID = require.params.id
   urlDatabase[sID] = require.body.newURL
   response.redirect(`/urls`)
})

app.post('/urls/:shortURL/delete', (require, response)=>{
   const shURL = require.params.shortURL
   delete urlDatabase[shURL]
   response.redirect(`/urls`)
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[require.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get('/urls.json', (require, response)=>{
   response.json(urlDatabase);
})

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, ()=>{
 console.log(`Example app listening on port ${PORT}`)
})