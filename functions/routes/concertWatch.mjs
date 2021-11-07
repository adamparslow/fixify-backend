import express from "express";
import md5 from 'md5';
import fetch from 'node-fetch';
import { registerArtistConcertPage, isArtistConcertPageRegistered } from "../service/artistConcertPageStorage.mjs";
import SpotifyApi from "../models/spotifyApi.mjs";
// import fs from 'fs';

const router = express.Router();

router.post("/register_artist", async (req, res) => {
    const artistId = req.body.artist_id;
    const url = req.body.url;

    const webPage = await fetch(url);
    const text = await webPage.text();
    const hash = md5(text);

    await registerArtistConcertPage(artistId, {
        url,
        hash
    });

	res.json({
		"data": "",
		"access_token": req.headers.accessToken,
		"expires_at": req.headers.expiresAt
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
                id: artist.id,
                image: artist.images[2]
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