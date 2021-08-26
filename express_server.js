const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

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

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
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