//@ts-check

// @ts-ignore
import SpotifyApi from './spotifyApi.mjs';
// @ts-ignore
import megamixStorage from './megamixStorage.mjs';

export default {
    generateMegamixes: () => 
        megamixStorage.getMegamixes(generateMegamixesWithData)
}

const generateMegamixesWithData = (records) => {
    console.log(records);
    // For each record
    records.forEach((record) => {
        let accessToken = 0;
        let refreshToken = record.refreshToken;
        
        console.log(refreshToken);

        const spotifyApi = new SpotifyApi(accessToken, refreshToken);
                                      
        // Get playlists and find the links to the daily mixes
        const playlists = spotifyApi.getPlaylists();
        console.log(playlists);

        // Get all tracks of daily mixes

        // Create new playlist with all songs
    });
}