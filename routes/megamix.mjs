import express from "express";

import megamixStorage from "../models/megamixStorage.mjs";
import megamixCreator from "../models/megamixCreator.mjs";
import SpotifyApi from "../models/spotifyApi.mjs";

const router = express.Router();

router.post("/save_megamix", (req, res) => {
	const refreshToken = req.body.refresh_token;
	const userId = req.body.user_id;

	if (!refreshToken || !userId) {
		res.sendStatus(400);
	}

	megamixStorage.registerUser(refreshToken, userId);

	res.send(refreshToken);
});

router.post("/get_megamixes", (req, res) => {
	megamixCreator.generateMegamixes();

	res.sendStatus(200);
});

router.post("/clear", (req, res) => {
	megamixStorage.clearMegamixes();

	res.sendStatus(200);
});

router.get("/register", async (req, res) => {
	const refreshToken = req.query.refresh_token;
	const spotifyApi = new SpotifyApi("", refreshToken);
	const user = await spotifyApi.getMyUserID();

	const isRegistered = megamixStorage.isRegistered(user.id);

	res.send(isRegistered);
});

router.post("/register", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	const spotifyApi = new SpotifyApi("", refreshToken);
	const user = await spotifyApi.getMyUserID();

	megamixStorage.registerUser(refreshToken, user.id);

	res.sendStatus(200);
});

router.delete("/register", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	const spotifyApi = new SpotifyApi("", refreshToken);
	const user = await spotifyApi.getMyUserID();

	megamixStorage.deregisterUser(user.id);

	res.sendStatus(200);
});

router.post("/generate", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	const spotifyApi = new SpotifyApi("", refreshToken);
	const user = await spotifyApi.getMyUserID();

	megamixCreator.generateMegamixFromRefreshToken(refreshToken, user.id);

	res.sendStatus(200);
});

export default router;
