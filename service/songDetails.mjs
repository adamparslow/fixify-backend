
export const getSongDetails = async (id, spotifyApi) => {
    const playlistNames = await getPlaylistsThatContainTheSong(id, spotifyApi)
    const audioFeaturesResponse = await spotifyApi.getAudioFeatures([id]);
    const audioFeatures = audioFeaturesResponse.audio_features[0];
    const addedAt = await getWhenSongWasLiked(id, spotifyApi);


    return {
        playlists: playlistNames,
        audioFeatures: {
            danceability: audioFeatures.danceability, 
            energy: audioFeatures.energy, 
            loudness: audioFeatures.loudness,
            speechiness: audioFeatures.speechiness,
            acousticness: audioFeatures.acousticness,
            instrumentalness: audioFeatures.instrumentalness,
            liveness: audioFeatures.liveness,
            valence: audioFeatures.valence,
            tempo: audioFeatures.tempo
        },
        addedAt
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

const getWhenSongWasLiked = async (id, spotifyApi) => {
    const likedSongs = await spotifyApi.getLikedSongs();
    let likedSong = null;
    likedSongs.forEach(song => {
        if (song != null && song.track.id === id) {
            likedSong = song;
        }
    });
    return likedSong.added_at;
}