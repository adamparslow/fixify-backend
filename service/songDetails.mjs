
export const getSongDetails = async (id, spotifyApi) => {
    const playlistNames = await getPlaylistsThatContainTheSong(id, spotifyApi)

    return {
        playlists: playlistNames
    }
}

const getPlaylistsThatContainTheSong = async (id, spotifyApi) => {
    const containingPlaylists = [];
    const promises = [];

    const allPlaylists = await spotifyApi.getPlaylists();
    const userInfo = await spotifyApi.getMyUserID();
    const userId = userInfo.id;
    // console.log(userId);
    console.log(id);

    allPlaylists.forEach(playlist => {
        promises.push((async () => {
            if (playlist.owner.id !== userId) {
                return;
            }

            const tracks = await spotifyApi.getPlaylistTracks(playlist.href);
                // tracks.forEach(track => console.log(track.track.id));
            if (tracks.some(track => track.track.id == id)) {
                console.log(playlist.name);
                containingPlaylists.push(playlist.name);
            }
        })());
    });
    await Promise.all(promises);

    // console.log(playlists);

    return containingPlaylists;
}