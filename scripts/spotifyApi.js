async function getPlaylists() {
    const url = next !== undefined ? next : 
        config.spotifyAPI + 'v1/me/playlists?limit=50';
    
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
    console.log(response);
    return await response.json();
}

async function makeApiRequest(url) {
    let response = await fetch(url, getData());
    if (response.status == 401) {
        await refreshToken();
        response = await fetch(url, getData());
    }
    return response;
}

async function refreshToken() {
    const accessToken = getNewAccessToken();
    localStorage.setItem('access_token', accessToken);
}

async function getNewAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    console.log(refreshToken);
    const url = `/refresh_token?refresh_token=${refreshToken}`;
    const response = await fetch(url, getData());
    const json = await response.json();
    return json.access_token;
}

function getData() {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
}

export default {
    getPlaylists,
    getPlaylistCoverArt
};