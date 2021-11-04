import SpotifyApi from "./spotifyApi.mjs";
import megamixStorage from "./megamixStorage.mjs";
import Jimp from "jimp";
import fs from "fs";

const name = "Megamix";
const description = "Combined daily mix - created by Fixify";

const generateMegamixes = async () => {
	const records = await megamixStorage.getMegamixes();
	for (const record of records) {
		generateMegamixFromRefreshToken(record.refreshToken, record.userId);
	}
};

const generateMegamixFromRefreshToken = async (refreshToken, userId) => {
	let accessToken = 0;
	let expiresAt = 0;

	const spotifyApi = new SpotifyApi(accessToken, refreshToken, expiresAt);

	// Get playlists and find the links to the daily mixes
	const playlists = await spotifyApi.getPlaylists();

	const dailyMixes = playlists.filter((playlist) =>
		playlist.name.includes("Daily Mix")
	);

	// Get all tracks of daily mixes
	const allTrackURIs = [];
	for (const mix of dailyMixes) {
		const tracks = await spotifyApi.getPlaylistTracks(mix.href);
		const uris = tracks
      .filter((track) => track.track !== null)
      .map((track) => track.track.uri);

		allTrackURIs.push(...uris);
	}

	// Create new playlist
	let megamix = playlists.filter((playlist) => playlist.name == "Megamix")[0];
	if (megamix) {
		const megamixTracks = await spotifyApi.getPlaylistTracks(megamix.href);
		const megamixUris = megamixTracks.map((track) => track.track.uri);

		await spotifyApi.removeTracksFromPlaylist(megamix, megamixUris);
	} else {
		console.log("Getting new megamix");
		megamix = await spotifyApi.createPlaylist(userId, name, description);
	}

	const megamixExternalUrl = megamix.external_urls.spotify;

	// console.log("Megamix");
	// console.log(megamix);

	// Add songs to playlist
	const response = await spotifyApi.addTracksToPlaylist(
		megamix,
		allTrackURIs
	);

	addMegamixPlaylistImage(megamix, dailyMixes, spotifyApi);

	return megamixExternalUrl;
};

async function addMegamixPlaylistImage(megamix, dailyMixes, spotifyApi) {
	// Get 4 daily mix playlist images
	const mixImageUrls = dailyMixes.map((mix, index) => {
		return {
			url: mix.images[0].url,
			x: index % 2,
			y: Math.floor(index / 2)
		};
	});
	
	// Combine them into one
	const mixImageSize = 640;
	const finalImageSize = mixImageSize * 2;
	const image = new Jimp(finalImageSize, finalImageSize);
	image.background(0x2a5c2cFF); // #53b857
	const promises = [];

	mixImageUrls.forEach(urlObj => {
		promises.push(
			Jimp.read(urlObj.url).then(playlistImage => {
				image.composite(playlistImage, urlObj.x * mixImageSize, urlObj.y * mixImageSize);
			})
		)
	});

	await Promise.all(promises);
	image.opacity(0.5);

	// Add overlay to the image
	const overlay = await Jimp.read("assets/megamixThumbnail90.png");
	image.composite(overlay, 0, 0)
		.resize(512, 512);

	// Set the image as the playlist image
	const imageJpeg = await image.getBase64Async(Jimp.MIME_JPEG);

	const response = await spotifyApi.setPlaylistCoverArt(megamix.href, cleanBase64ForSpotify(imageJpeg));
	console.log(response);
}

function cleanBase64ForSpotify(base64) {
	return base64.split(",")[1];
}

export default {
	generateMegamixes,
	generateMegamixFromRefreshToken,
};
