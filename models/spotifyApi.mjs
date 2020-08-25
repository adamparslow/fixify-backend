import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const spotifyApiUrl = "https://api.spotify.com/";

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
    
    async getPlaylists() {
        const url = spotifyApiUrl + 'v1/me/playlists?limit=50';
        
        return await this.getPlaylistsRecursive(url);
    }

    async getPlaylistsRecursive(url) {
        const playlistInfo = await this.makeApiRequestAndProcessJson(url);
        console.log(playlistInfo);

        if (playlistInfo.items.length === playlistInfo.limit) {
            const newPlaylistInfo = await this.getPlaylistsRecursive(playlistInfo.next);
            playlistInfo.items.concat(newPlaylistInfo.items);
        }

        return playlistInfo.items;
    }

    async getPlaylistCoverArt(playlist, size) {
        const url = playlist.href + '/tracks';

        const coverArtAllSizes = await this.makeApiRequestAndProcessJson(url);

        const coverArt = coverArtAllSizes.items.map((song) => song.track.album.images[size]);
        return coverArt;
    }

    async makeApiRequestAndProcessJson(url) {
        const response = await this.makeApiRequest(url);
        return await response.json();
    }

    async makeApiRequest(url) {
        let response = await fetch(url, this.getHeaders());
        if (response.status == 401) {
            await this.refreshAccessToken();
            response = await fetch(url, this.getHeaders());
        }
        return response;
    }

    async refreshAccessToken() {
        // const url = `${spotifyApiUrl}/auth/refresh_token?refresh_token=${this._refreshToken}`;
        const url = `https://accounts.spotify.com/api/token`;
        const idAndSecret = new Buffer(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64');
        
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('grant_type', 'refresh_token');
        urlSearchParams.append('refresh_token', this.refreshToken);
        urlSearchParams.append('client_id', process.env.CLIENT_ID);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + idAndSecret
            },
            body: urlSearchParams
        });

        const json = await response.json();

        this._accessToken = json.access_token;
    }

    getHeaders() {
        return {
            headers: {
                Authorization: 'Bearer ' + this.accessToken
            }
        };
    }
}