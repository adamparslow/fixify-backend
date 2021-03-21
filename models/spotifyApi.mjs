import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export default class SpotifyApi {
	constructor(accessToken, refreshToken) {
		this._accessToken = accessToken;
		this._refreshToken = refreshToken;
	}

	get accessToken() {
		return this._accessToken;
	}

	get refreshToken() {
		return this._refreshToken;
	}

	// Public
	async getPlaylists() {
		const url = process.env.SPOTIFY_API_URI + "me/playlists?limit=50";

		return await this.getPlaylistsRecursive(url);
	}

	async getPlaylistsRecursive(url) {
		const playlistInfo = await this.makeApiRequestAndProcessJson(
			"GET",
			url
		);
		
		let items = playlistInfo.items;

		if (items.length === playlistInfo.limit) {
			const newItems = await this.getPlaylistsRecursive(
				playlistInfo.next
			);
			items = items.concat(newItems);
		}

		return playlistInfo.items;
	}

	// Public
	async getPlaylistCoverArt(playlistHref, size) {
		const tracks = await this.getPlaylistTracks(playlistHref);

		const coverArt = tracks.map((song) => song.track.album.images[size]);
		return coverArt;
	}

	// Public
	async getPlaylistTracks(playlistHref) {
		const url = playlistHref + "/tracks";

		return await this.getPlaylistTracksRecursive(url);
	}

	async getPlaylistTracksRecursive(url) {
		const tracks = await this.makeApiRequestAndProcessJson("GET", url);
		const trackItems = tracks.items;

		if (tracks.next) {
			const newTrackItems = await this.getPlaylistTracksRecursive(
				tracks.next
			);
			trackItems.push(...newTrackItems);
		}

		return trackItems;
	}

	// Public
	async createPlaylist(userID, playlistName, description) {
		const url = process.env.SPOTIFY_API_URI + `users/${userID}/playlists`;

		const body = {
			name: playlistName,
			description: description ? description : "",
		};

		return await this.makeApiRequestAndProcessJson("POST", url, body);
	}

	// Public
	async addTracksToPlaylist(playlist, uris) {
		const url =
			process.env.SPOTIFY_API_URI + `playlists/${playlist.id}/tracks`;
		const responses = [];

		for (let sent = 0; sent <= uris.length; sent += 100) {
			const body = {
				uris: uris.slice(0 + sent, 100 + sent),
			};

			const response = await this.makeApiRequestAndProcessJson(
				"POST",
				url,
				body
			);
			responses.push(response);
		};
		
		return responses;
	}

	// Public
	async removeTracksFromPlaylist(playlist, uris) {
		const url =
			process.env.SPOTIFY_API_URI + `playlists/${playlist.id}/tracks`;

		for (let sent = 0; sent <= uris.length; sent += 100) {
			const body = {
				uris: uris.slice(0 + sent, 100 + sent),
			};

			await this.makeApiRequestAndProcessJson("DELETE", url, body);
		}
	}

	// Public
	async getMyUserID() {
		const url = process.env.SPOTIFY_API_URI + "me";

		const response = await this.makeApiRequestAndProcessJson("GET", url);
		return response;
	}

	async makeApiRequestAndProcessJson(method, url, body) {
		const response = await this.makeApiRequest(method, url, body);
		return await response.json();
	}

	async makeApiRequest(method, url, body) {
		console.log(url);

		let response = await fetch(url, this.getHeaders(body, method));
		if (response.status == 401 || response.status == 400) {
			await this.refreshAccessToken();
			return await fetch(url, this.getHeaders(body, method));
		}
		return response;
	}

	getHeaders(body, method) {
		const header = {
			method: method,
			headers: {
				Authorization: "Bearer " + this.accessToken,
				"Content-Type": "application/json",
			},
		};

		if (method === "POST" || method === "DELETE") {
			header.body = JSON.stringify(body);
		}

		return header;
	}

	async refreshAccessToken() {
		// const url = `${spotifyApiUrl}/auth/refresh_token?refresh_token=${this._refreshToken}`;
		const url = `https://accounts.spotify.com/api/token`;
		const idAndSecret = new Buffer(
			process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
		).toString("base64");

		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append("grant_type", "refresh_token");
		urlSearchParams.append("refresh_token", this.refreshToken);
		// urlSearchParams.append("client_id", process.env.CLIENT_ID);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Basic " + idAndSecret,
			},
			body: urlSearchParams,
		});

		const json = await response.json();

		this._accessToken = json.access_token;
	}
}

