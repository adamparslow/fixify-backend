const express = require('express');
const path = require('path');
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8080;

var client_id = '791fe36d332a46dfbc596adaf06d224f'; // Your client id
var client_secret = 'a4fb8056d3b04b42aba8ec849fe413e5'; // Your secret
var redirect_uri = 'https://adamparslow-fixify.glitch.me/callback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

app.use(express.static('client/build'))
    .use(express.json())
    .use(cors())
    .use(cookieParser());

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'playlist-read-collaborative playlist-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});

app.get('/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
  
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
        
                // var options = {
                //     url: 'https://api.spotify.com/v1/me',
                //     headers: { 'Authorization': 'Bearer ' + access_token },
                //     json: true
                // };
        
                // use the access token to access the Spotify Web API
                // request.get(options, function(error, response, body) {
                //     console.log(body);
                // });
        
                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', (req, res) => {

});

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/index.html"));
});

app.get("/feature/collage", (req, res) => {
    res.sendFile(path.join(__dirname, "html/collage.html"));
});

app.get("/feature/*", (req, res) => {
    console.log(req.originalUrl);
    res.send("Not yet implemented");
});

app.get("*", (req, res) => {
    let url = req.originalUrl.slice(1);
    if (url === "") url = "index.html";
    res.sendFile(path.join(__dirname, url));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})