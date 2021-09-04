import express from "express";
import SpotifyApi from "../models/spotifyApi.mjs";

const router = express.Router();

router.get("/playlists", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const playlists = await spotifyApi.getPlaylists();
	const response = generateResponse(spotifyApi, playlists);
});

router.get("/cover_art", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;
	const playlist = req.query.playlist;
	const size = req.query.size;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const coverArt = await spotifyApi.getPlaylistCoverArt(playlist, size);

	res.send(generateResponse(spotifyApi, coverArt));
});

router.get("/liked_songs", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const likedSongs = await spotifyApi.getLikedSongs();

	res.send(generateResponse(spotifyApi, likedSongs.filter((trackData) => trackData.track.name === "VBS")));
})

function generateResponse(spotifyApi, data) {
	return {
		data, 
		access_token: spotifyApi.accessToken,
		expires_at: spotifyApi.expiresAt
	}
}

export default router;
