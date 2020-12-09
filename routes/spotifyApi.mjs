import express from "express";
import SpotifyApi from "../models/spotifyApi.mjs";

const router = express.Router();

router.get("/playlists", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const spotifyApi = new SpotifyApi(accessToken, refreshToken);

	const playlists = await spotifyApi.getPlaylists();

	res.send(playlists);
});

router.get("/cover_art", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const playlist = req.query.playlist;
	const size = req.query.size;
	console.log(playlist);
	const spotifyApi = new SpotifyApi(accessToken, refreshToken);

	const coverArt = await spotifyApi.getPlaylistCoverArt(playlist, size);

	res.send(coverArt);
});

export default router;
