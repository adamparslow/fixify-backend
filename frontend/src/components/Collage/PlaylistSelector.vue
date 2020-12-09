<template>
	<select id="playlist" name="playlist" required>
		<option value="" disabled selected>Select a playlist</option>
		<option
			v-for="playlist in playlists"
			:key="playlist.id"
			v-bind:value="playlist.href"
		>
			{{ playlist.name }}
		</option>
	</select>
</template>

<script>
// import tokenHandler from "@/model/tokenHandler.js";
import spotifyService from "@/model/spotifyService.js";

export default {
	data: function () {
		return {
			playlists: [],
		};
	},
	created: async function () {
		this.playlists = await spotifyService.getPlaylists();
		// Get the playlist information
	},
};
</script>

<style></style>
