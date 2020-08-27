import config from './../scripts/config.mjs';

function SpotifyApi(getAccessTokenFunc, getRefreshTokenFunc, setAccessTokenFunc) {
    const getAccessToken = getAccessTokenFunc;
    const getRefreshToken = getRefreshTokenFunc;
    const setAccessToken = setAccessTokenFunc;

    async function getPlaylists() {
        const url = config.spotifyAPI + 'v1/me/playlists?limit=50';
        
        return await getPlaylistsRecursive(url);
    }

    async function getPlaylistsRecursive(url) {
        const playlistInfo = await makeApiRequestAndProcessJson(url);

        if (playlistInfo.items.length === playlistInfo.limit) {
            const newPlaylistInfo = getPlaylistsRecursive(playlistInfo.next);
            playlistInfo.items.concat(newPlaylistInfo.items);
        }

        return playlistInfo.items;
    }

    async function getPlaylistCoverArt(playlist, size) {
        const url = playlist.href + '/tracks';

        const coverArtAllSizes = await makeApiRequestAndProcessJson(url);

        const coverArt = coverArtAllSizes.items.map((song) => song.track.album.images[size]);
        return coverArt;
    }

    async function makeApiRequestAndProcessJson(url) {
        const response = await makeApiRequest(url);
        return await response.json();
    }

    async function makeApiRequest(url) {
        let response = await fetch(url, getHeaders());
        if (response.status == 401) {
            await refreshAccessToken();
            response = await fetch(url, getHeaders());
        }
        return response;
    }

    async function refreshAccessToken() {
        const accessToken = await getNewAccessToken();

        setAccessToken(accessToken);
    }

    async function getNewAccessToken() {
        const refreshToken = getRefreshToken();
        const url = `/auth/refresh_token?refresh_token=${refreshToken}`;
        const response = await fetch(url, getHeaders());
        const json = await response.json();
        return json.access_token;
    }

    function getHeaders() {
        const token = getAccessToken();
        return {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    }

    return {
        getPlaylists,
        getPlaylistCoverArt
    }
}


export default SpotifyApi;