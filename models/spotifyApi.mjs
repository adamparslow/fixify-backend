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
		const playlistInfo = await this.makeApiRequestAndProcessJson("GET", url);

		if (playlistInfo.items.length === playlistInfo.limit) {
			const newPlaylistInfo = await this.getPlaylistsRecursive(
				playlistInfo.next
			);
			playlistInfo.items.concat(newPlaylistInfo.items);
		}

		return playlistInfo.items;
	}

	// Public
	async getPlaylistCoverArt(playlist, size) {
		const tracks = getPlaylistTracks(playlist);

		const coverArt = tracks.map((song) => song.track.album.images[size]);
		return coverArt;
	}

	// Public
	async getPlaylistTracks(playlist) {
        const url = playlist.href + '/tracks';

        return await this.getPlaylistTracksRecursive(url);
    }
    
    async getPlaylistTracksRecursive(url) {
        const tracks = await this.makeApiRequestAndProcessJson("GET", url);
        const trackItems = tracks.items;

        if (tracks.next) {
            const newTrackItems = await this.getPlaylistTracksRecursive(tracks.next);
            trackItems.push(...newTrackItems);
        }

		return trackItems;
    }

	// Public
	async createPlaylist(userID, playlistName, description) {
		const url = process.env.SPOTIFY_API_URI + `users/${userID}/playlists`;

		const body = {
			name: playlistName,
			description: description ?? "",
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
		}
		return responses;
	}

	// Public
	async removeTracksFromPlaylist(playlist, uris) {
		const url =
			process.env.SPOTIFY_API_URI + `playlists/${playlist.id}/tracks`;

        console.log(uris.length);
		for (let sent = 0; sent <= uris.length; sent += 100) {
            console.log("Im running");
			const body = {
				uris: uris.slice(0 + sent, 100 + sent),
			};

			await this.makeApiRequestAndProcessJson("DELETE", url, body);
		}
	}

	// async makeApiGetRequestAndProcessJson(url) {
	// 	const response = await this.makeApiGetRequest(url);
	// 	return await response.json();
	// }

	// async makeApiGetRequest(url) {
	// 	let response = await fetch(url, this.getHeaders());
	// 	if (response.status == 401) {
	// 		await this.refreshAccessToken();
	// 		response = await fetch(url, this.getHeaders());
	// 	}
	// 	return response;
	// }

	// async makeApiPostRequestAndProcessJson(url, body) {
	// 	const response = await this.makeApiPostRequest(url, body);
	// 	return await response.json();
	// }

	// async makeApiPostRequest(url, body) {
	// 	let response = await fetch(url, this.getHeaders(body));
	// 	if (response.status == 401) {
	// 		await this.refreshAccessToken();
	// 		let response = await fetch(url, this.getHeaders(body, "POST"));
	// 	}
	// 	return response;
	// }

	async makeApiRequestAndProcessJson(method, url, body) {
		const response = await this.makeApiRequest(method, url, body);
		return await response.json();
	}

	async makeApiRequest(method, url, body) {
		let response = await fetch(url, this.getHeaders(body, method));
		if (response.status == 401) {
			await this.refreshAccessToken();
			return await fetch(url, this.getHeaders(body, method));
		}
		return response;
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
		urlSearchParams.append("client_id", process.env.CLIENT_ID);

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

	getHeaders(body, method) {
        const header = {
            method: method,
			headers: {
				Authorization: "Bearer " + this.accessToken,
                "Content-Type": "application/json",
			}
        }
        
        if (method === "POST" || method === "DELETE") {
            header.body = JSON.stringify(body);
        }

		return header;
	}
}
