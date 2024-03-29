import { SSL_OP_TLS_BLOCK_PADDING_BUG } from "constants";
import express from "express";
import querystring from "querystring";
import request from "request";
import config from '../config/index.mjs';


let router = express.Router();
export default router;

var stateKey = "spotify_auth_state";

router.get("/login", (req, res) => {
	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	var scope =
		"playlist-read-collaborative playlist-read-private playlist-modify-public playlist-modify-private user-read-private user-library-read ugc-image-upload user-follow-read user-follow-modify";
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: config.spotify.client_id,
				scope: scope,
				redirect_uri: config.fixify.redirect_uri,
				state: state,
			})
	);
});

var generateRandomString = function (length) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

router.get("/callback", (req, res) => {
	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	// var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null) { // || state !== storedState) {
		res.redirect(
			"/#" +
				querystring.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		res.clearCookie(stateKey);
		var authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: config.fixify.redirect_uri,
				grant_type: "authorization_code",
			},
			headers: {
				Authorization:
					"Basic " +
					new Buffer(
						config.spotify.client_id + ":" + config.spotify.client_secret
					).toString("base64"),
			},
			json: true,
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token,
					refresh_token = body.refresh_token,
					expires_at = Date.now() + body.expires_in * 1000;

				console.log("access token");
				console.log(access_token);
				console.log("refresh token");
				console.log(refresh_token);
				console.log("expires at");
				console.log(expires_at)

				// we can also pass the token to the browser to make requests from there
				res.redirect(
					config.fixify.frontend_uri + 
					"#/auth/collect/" +
						querystring.stringify({
							access_token: access_token,
							refresh_token: refresh_token,
							expires_at: expires_at
						})
				);
			} else {
				res.redirect(
					"/#" +
						querystring.stringify({
							error: "invalid_token",
						})
				);
			}
		});
	}
});

router.get("/refresh_token", (req, res) => {
	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			Authorization:
				"Basic " +
				new Buffer(
					config.spotify.client_id + ":" + config.spotify.client_secret
				).toString("base64"),
		},
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				access_token: access_token,
			});
		}
	});
});
