import tokenHandler from "@/model/tokenHandler.js";

// TODO: replace with .env
const urlStart = "http://localhost:3000"

const getPlaylists = async () => {
	const url = urlStart + "/spotify/playlists";

	const response = await fetch(url, {
		headers: {
			access_token: tokenHandler.getAccessToken(),
			refresh_token: tokenHandler.getRefreshToken(),
		},
	});

	return await response.json();
};

const getPlaylistCoverArt = async (playlistHref, size) => {
	const url = `${urlStart}/spotify/cover_art?playlist=${playlistHref}&size=${size}`;

	const response = await fetch(url, {
		headers: {
			access_token: tokenHandler.getAccessToken(),
			refresh_token: tokenHandler.getRefreshToken(),
		},
	});
	return await response.json();
};

export default {
	getPlaylists,
	getPlaylistCoverArt,
};
