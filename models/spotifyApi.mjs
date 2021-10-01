import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export default class SpotifyApi {
	constructor(accessToken, refreshToken, expiresAt) {
		this._accessToken = accessToken;
		this._refreshToken = refreshToken;
		this._expiresAt = expiresAt
	}

	get accessToken() {
		return this._accessToken;
	}

	get refreshToken() {
		return this._refreshToken;
	}

	get expiresAt() {
		return this._expiresAt;
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

		return items;
	}

	// Public
	async getPlaylistCoverArt(playlistHref, size) {
		const tracks = await this.getPlaylistTracks(playlistHref);

		const coverArt = tracks.map((song) => song.track.album.images[size]);
		return coverArt;
	}

	// Public
	async setPlaylistCoverArt(playlistHref, image) {
		const url = playlistHref + "/images";
		console.log(url);
		const response = await this.makeApiRequest(url, () => this.getJPEGHeaders(image, "PUT"))
		return response;
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

	// Public
	async getLikedSongs() {
		console.log("Start of liked songs: " + Date.now());
		const url = process.env.SPOTIFY_API_URI + "me/tracks?limit=50";
		const promises = [];

		const initialResponse = await this.makeApiRequestAndProcessJson("GET", url);
		const totalTracks = initialResponse.total;

		const tracks = Array(totalTracks);
		initialResponse.items.forEach((af, j) => {
			tracks.splice(j, 1, af);
		});

		for (let i = 50; i <= totalTracks; i += 50) {
			promises.push((async () => {
				const currUrl = url + "&offset=" + i;
				const response = await this.makeApiRequestAndProcessJson("GET", currUrl);
				response.items.forEach((af, j) => {
					tracks.splice(i + j, 1, af);
				});
			})());
		}

		await Promise.all(promises);
		console.log("End of liked songs:   " + Date.now());
		return tracks;
	}

	// Public
	async getAudioFeatures(ids) {
		const BATCH_SIZE = 100;
		const audioFeatures = Array(ids.length);
		const promises = [];

		for (let i = 0; i < ids.length; i += BATCH_SIZE) {
			promises.push((async () => {
				const idString = ids.slice(i, i+BATCH_SIZE).join(",");
				const url = process.env.SPOTIFY_API_URI + "audio-features?ids=" + idString;
				const response = await this.makeApiRequestAndProcessJson("GET", url);
				const audioFeaturesSlice = response.audio_features;
				// audioFeatures = audioFeatures.concat(audioFeaturesSlice.audio_features);

				audioFeaturesSlice.forEach((af, j) => {
					audioFeatures.splice(i + j, 1, af);
				});
			})());
		}
		await Promise.all(promises);

		return audioFeatures;
	}


	// **************************************************

	async makeApiRequestAndProcessJson(method, url, body) {
		const response = await this.makeApiRequest(url, () => this.getHeaders(body, method));
		const json = await response.json();
		return json;
	}

	async makeApiRequest(url, getData) {
		if (this.expiresAt < Date.now()) {
			await this.refreshAccessToken();
		}

		let response = await fetch(url, getData());

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

		if (method === "POST" || method === "DELETE" || method === "PUT") {
			header.body = JSON.stringify(body);
		}

		return header;
	}

	getJPEGHeaders(body, method) {
		const headers = this.getHeaders(body, method);
		headers.headers["Content-Type"] = "image/jpeg"
		headers.body = body;
		return headers;
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
		this._expiresAt = Date.now() + json.expires_in * 1000;
	}
}

