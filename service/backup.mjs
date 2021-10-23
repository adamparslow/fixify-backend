import { storeLikedSongs, getLikedSongs } from "./likedSongStorage.mjs";

export const backupLikedSongs = async (spotifyApi, userId, force) => {
	const likedSongData = await getLikedSongs(userId);
	if (likedSongData.expires_at !== undefined && 
		likedSongData.expires_at > Date.now() && !force) 
		return likedSongData.likedSongs;

	let likedSongs = await spotifyApi.getLikedSongs();
	likedSongs = likedSongs.map((songData) => {
		return {
			added_at: songData.added_at,
			name: songData.track.name,
			album: songData.track.album.name,
			artists: songData.track.artists.map(artist => artist.name),
			id: songData.track.id
		}
	});

	await storeLikedSongs(userId, {
		expires_at: Date.now() + 5*60*1000,
		likedSongs
	});
	return likedSongs;
}