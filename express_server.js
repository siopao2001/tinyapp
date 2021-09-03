const { response } = require('express');
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

const { generateRandomString, urlsForUser, emailSearch } = require("./helpers");


// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

const bcrypt = require('bcryptjs');

// function generateRandomString(len) {
//   var ans = '';
//   const array = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrtsuvwxyz123456789123456789123456789123456789';
//   for (var i = len; i > 0; i--) {
//     ans +=
//       array[Math.floor(Math.random() * array.length)];
//   }
//   return ans;
// };

// function emailSearch(userEmail, database) {
//   for (item in database) {
//     if (database[item].email === userEmail) {
//       return database[item]
//     }
//   }
//   return false
// };

// function urlsForUser(id, data) {
//   let newObject = {}
//   for (url in data) {
//     if (data[url].userID === id) {
//       newObject[url] = {
//         longURL: data[url].longURL,
//         userID: data[url].userID
//       }
//     }
//   }
//   return newObject
// };

app.set('view engine', 'ejs')

const urlDatabase =  {};

const users = {}

app.get('/', (require, response)=>{
   response.redirect('/login');
});

app.get('/login', (require, response) => {
  if (/*users[require.cookies["user_id"]]*/users[require.session.user_id]) {
    response.send('Please sign out to log in as a different user ')
  } else {
    const templateVars = {
      user: users[require.session.user_id]/*users[require.cookies["user_id"]]*/
    }
    response.render(`urls_login`, templateVars)
  }
})


app.post('/login', (require, response)=>{
   const userInfo = emailSearch(require.body.email, users)
   if(userInfo.email !== require.body.email) {
        response.status(403).send("Email does not exist")
  }else if(bcrypt.compareSync(require.body.password, userInfo.password) === false){
        response.status(403).send("Invalid password")
  }else{
        //response.cookie('user_id', userInfo.id)
        require.session.user_id = userInfo.id
        response.redirect(`/urls`)
  }
})

app.post('/logout', (require, response)=>{
   require.session = null 
   response.redirect(`/login`)
})

app.get('/register', (require, response) => {
  if (/*users[require.cookies["user_id"]]*/users[require.session.user_id]) {
    response.redirect('/urls')
  } else {
    const templateVars = {
      user: /*users[require.cookies["user_id"]]*/users[require.session.user_id]
    }
    response.render('urls_register', templateVars);
  }
})

app.post('/register', (require, response) => {
  if (require.body.email === '' || require.body.password === '') {
    response.status(400).send("Please fill out the email and password fields")
  } else if (emailSearch(require.body.email, users).email === require.body.email) {
    response.status(400).send("Email already exists")
  } else {
    const userID = generateRandomString(6)
    users[userID] = {
      id: userID,
      email: require.body.email,
      password: bcrypt.hashSync(require.body.password, 10)
    }
    // response.cookie('user_id', userID)
    require.session.user_id = userID
    response.redirect(`/urls`)
  }
})

app.get('/urls', (require, response) => {
  if (/*!users[require.cookies["user_id"]]*/!users[require.session.user_id]) {
    response.send("Please log in or register")
  } else {
    const templateVars = {
      urls: urlsForUser(/*require.cookies["user_id"]*/require.session.user_id, urlDatabase),
      user: users[/*require.cookies["user_id"]*/require.session.user_id]
    }
    response.render('urls_index', templateVars);
  }
})

app.get('/urls/new', (require, response) => {
  if (/*!users[require.cookies["user_id"]]*/!users[require.session.user_id]) {
    response.redirect('/login')
  } else {
    const templateVars = {
      user: users[/*require.cookies["user_id"]*/require.session.user_id]
    }
    response.render('urls_new', templateVars)
  }
})

app.post('/urls', (require, response)=>{
   const randomString = generateRandomString(6)
   urlDatabase[randomString] = {longURL: require.body.longURL, userID: users[require.session.user_id].id /*users[require.cookies["user_id"]].id*/}
   response.redirect(`/urls/${randomString}`)
})

app.post('/urls/:id', (require, response)=>{
   const sID = require.params.id
   urlDatabase[sID].longURL = require.body.newURL
   response.redirect(`/urls`)
})

app.post('/urls/:shortURL/delete', (require, response)=>{
   if(/*!users[require.cookies["user_id"]]*/!users[require.session.user_id] || urlDatabase[require.params.shortURL].userID !== users[require.session.user_id].id/*users[require.cookies["user_id"]].id*/){
   response.send("Please login as the appropriate user")
 }else{
   const shURL = require.params.shortURL
   delete urlDatabase[shURL]
   response.redirect(`/urls`)
 }
})

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("This short URL has not been set")
  } else if (/*!users[req.cookies["user_id"]]*/!users[req.session.user_id] || urlDatabase[req.params.shortURL].userID !== users[req.session.user_id].id/*users[req.cookies["user_id"]].id*/) {
    res.status(401).send("Please login as the appropriate user")
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: /*users[req.cookies["user_id"]]*/users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(302).send("Ooops")
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL
    res.redirect(longURL);
  }
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