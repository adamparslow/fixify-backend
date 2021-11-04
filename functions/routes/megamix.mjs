import express from "express";

import megamixStorage from "../models/megamixStorage.mjs";
import megamixCreator from "../models/megamixCreator.mjs";
import SpotifyApi from "../models/spotifyApi.mjs";

const router = express.Router();

// Debug routes
router.post("/save_megamix", (req, res) => {
	const refreshToken = req.body.refresh_token;
	const userId = req.body.user_id;

	if (!refreshToken || !userId) {
		res.sendStatus(400);
	}

	megamixStorage.registerUser(refreshToken, userId);

	res.send(refreshToken);
});

router.post("/get_megamixes", async (req, res) => {
	await megamixCreator.generateMegamixes();

	res.sendStatus(200);
});

router.post("/clear", (req, res) => {
	megamixStorage.clearMegamixes();

	res.sendStatus(200);
});

// Real Routes
router.get("/register", async (req, res) => {
	const refreshToken = req.query.refresh_token;
	const spotifyApi = new SpotifyApi("", refreshToken, 0);
	const user = await spotifyApi.getMyUserID();

	const isRegistered = await megamixStorage.isRegistered(user.id);
	console.log(isRegistered);

	res.send(isRegistered);
});

router.post("/register", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	const spotifyApi = new SpotifyApi("", refreshToken, 0);
	const user = await spotifyApi.getMyUserID();

	await megamixStorage.registerUser(refreshToken, user.id);

	res.sendStatus(200);
});

router.delete("/register", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	const spotifyApi = new SpotifyApi("", refreshToken, 0);
	const user = await spotifyApi.getMyUserID();

	await megamixStorage.deregisterUser(user.id);

	res.sendStatus(200);
});

router.post("/generate", async (req, res) => {
	const refreshToken = req.body.refresh_token;
	const accessToken = req.body.access_token;
	const expiresAt = req.body.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);
	const user = await spotifyApi.getMyUserID();

	const url = await megamixCreator.generateMegamixFromRefreshToken(refreshToken, user.id);

	res.json({
		"url": url,
		"access_token": spotifyApi.accessToken,
		"expires_at": spotifyApi.expiresAt
	});
});

export default router;
