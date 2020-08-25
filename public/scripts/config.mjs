const config = {
    spotifyAPI: "https://api.spotify.com/",
    spotifyAuth: "https://accounts.spotify.com/authorize",
    clientId: "791fe36d332a46dfbc596adaf06d224f",
    redirectUri: "http://localhost:8080",

    pages: [
        {
            title: "Collage",
            url: "feature/collage"
        },
        {
            title: "Mega Mix", 
            url: "feature/mega-mix"
        },
        // {
        //     title: "Album Downloader",
        //     url: "feature/album-downloader"
        // },
        // {
        //     title: "Artist Follower",
        //     url: "feature/artist-follower"
        // },
        // {
        //     title: "Playlist Correcter",
        //     url: "feature/playlist-correcter"
        // },
        // {
        //     title: "Song Correcter",
        //     url: "feature/song-correcter"
        // }
    ]
};
export default config;