import SpotifyApi from "./spotifyApi.mjs";
import megamixStorage from "./megamixStorage.mjs";

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

	console.log(refreshToken);

	const spotifyApi = new SpotifyApi(accessToken, refreshToken);

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

	return megamixExternalUrl;
};

export default {
	generateMegamixes,
	generateMegamixFromRefreshToken,
};
