var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;

var org = nforce.createConnection({
  clientId: '3MVG9ZF4bs_.MKujzrO9lzVI.zVlgPfPBBRLLeIQ6vXxkQc3aHIGdcF95AHuCTIKZjV4V6l0LSmVA9CzKqrmP',
  clientSecret: 'ACC1D412A8A107E5C4F108F69A3C3EB1269BF02B6519B4AD4EA8E92559C1AEE3',
  //redirectUri: 'https://lightning-out-component.herokuapp.com/oauth/_callback',
  redirectUri: 'https://localhost:3000/oauth/_callback',
  //apiVersion: '44.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});
var oauth;
org.authenticate({ username: 'erinbrown@telcoidospring19.demo', password: 'publicpass1234'}, function(err, resp){
  // store the oauth object for this user
  if(!err){
     oauth = resp;
     console.log("conectado");
     console.log(oauth);

  }
});

console.log("getau: "+ org.getAuthUri());
var app = express();
// Require Routes js
var routesHome = require('./routes/home');
var routesMovistarColombiaAtencion = require('./routes/movistarcolombiaatencion');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);
app.use('/movistarcolombiaatencion', routesMovistarColombiaAtencion);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://telcoidospring19.lightning.force.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
app.listen(port, () => console.log(`Example app listening on port ${port}!`))