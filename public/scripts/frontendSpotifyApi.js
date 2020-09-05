import SpotifyApi from '../shared/spotifyApi.mjs';
import tokenHandler from './tokenHandler.js';

const frontendSpotifyApi = SpotifyApi(tokenHandler.getAccessToken, tokenHandler.getRefreshToken, tokenHandler.setAccessToken);

export default {
    getPlaylists: frontendSpotifyApi.getPlaylists,
    getPlaylistCoverArt: frontendSpotifyApi.getPlaylistCoverArt
};