import { storeLikedSongs } from "./likedSongStorage.mjs";

export const backupLikedSongs = async (spotifyApi, userId) => {
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
	storeLikedSongs(userId, likedSongs);
	return likedSongs;
}