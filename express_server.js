const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString(len) {
  var ans = '';
  const array = 'abcdefghijklmnopqrstuvwxyz123456789123456789';
  for (var i = len; i > 0; i--) {
    ans +=
      array[Math.floor(Math.random() * array.length)];
  }
  return ans;
}

app.set('view engine', 'ejs')

const urlDatabase =  {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (require, response)=>{
   response.send('Hello!');
});

app.get('/urls', (require, response)=>{
   const templateVars = {urls: urlDatabase}
   response.render('urls_index', templateVars);
})

app.get('/urls/new',(require, response)=>{
   response.render('urls_new')
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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