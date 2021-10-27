import express from "express";
import { registerArtistConcertPage, isArtistConcertPageRegistered } from "../service/artistConcertPageStorage.mjs";
import SpotifyApi from "../models/spotifyApi.mjs";

const router = express.Router();

router.post("/register_artist", async (req, res) => {
    const artistId = req.body.artist_id;
    const url = req.body.url;

    await registerArtistConcertPage(artistId, {
        url: url,
        hash: ""
    });

	res.json({
		"data": "",
		"access_token": spotifyApi.accessToken,
		"expires_at": spotifyApi.expiresAt
	});
});

router.get("/setup", async (req, res) => {
	const refreshToken = req.headers.refresh_token;
	const accessToken = req.headers.access_token;
	const expiresAt = req.headers.expires_at;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

    const artists = await spotifyApi.getFollowedArtists();
    const artistsToSetup = [];
    const promises = [];

    artists.forEach(artist => {
        promises.push(isArtistConcertPageRegistered(artist.id)
            .then(result => !result && artistsToSetup.push({
                name: artist.name,
                id: artist.id
            })));
    });

    await Promise.all(promises);

    console.log(artistsToSetup)

	res.json({
		"data": artistsToSetup,
		"access_token": spotifyApi.accessToken,
		"expires_at": spotifyApi.expiresAt
	});
});

export default router;