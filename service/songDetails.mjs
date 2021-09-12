export const getSongDetails = async (id, spotifyApi) => {
    const playlistNames = await getPlaylistsThatContainTheSong(id, spotifyApi)

    return {
        playlists: playlistNames
    }
}

const getPlaylistsThatContainTheSong = async (id, spotifyApi) => {
    const playlists = spotifyApi.getPlaylists()    

    return ['playlistName']
}