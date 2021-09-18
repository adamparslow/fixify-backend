import express from "express";
import SpotifyApi from "../models/spotifyApi.mjs";
import { getSongDetails } from "../service/songDetails.mjs";
import { getMoodRingData } from "../service/moodRing.mjs";

const router = express.Router();

router.get("/playlists", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const playlists = await spotifyApi.getPlaylists();
	const response = generateResponse(spotifyApi, playlists);
	res.send(generateResponse(spotifyApi, response));
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

	let likedSongs = await spotifyApi.getLikedSongs();

	likedSongs = likedSongs.map((songData) => {
		return {
			added_at: songData.added_at,
			name: songData.track.name,
			album: songData.track.album.name,
			artists: songData.track.artists.map(artist => artist.name),
			id: songData.track.id
		}
	})

	res.send(generateResponse(spotifyApi, likedSongs));
});

router.get("/song_details", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;
	const songId = req.query.id;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const response = await getSongDetails(songId, spotifyApi);

	res.send(generateResponse(spotifyApi, response));
});

router.get("/mood_ring", async (req, res) => {
	const accessToken = req.headers.access_token;
	const refreshToken = req.headers.refresh_token;
	const expiresAt = req.headers.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	const response = await getMoodRingData(spotifyApi);

	res.send(generateResponse(spotifyApi, response));
});

function generateResponse(spotifyApi, data) {
	return {
		data, 
		access_token: spotifyApi.accessToken,
		expires_at: spotifyApi.expiresAt
	}
}

export default router;
