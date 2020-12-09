<template>
	<form autocomplete="off" id="image-form" v-on:submit.prevent="submitForm">
		<div>
			<PlaylistSelector />
		</div>
		<div>
			<select id="ratio" name="ratio" required>
				<option value="" disabled selected>Select a size</option>
				<option value="16x9">Laptop (16x9) - Landscape</option>
				<option value="9x16">Laptop (16x9) - Portrait</option>
				<option value="4x3">Tablet (4x3) - Landscape</option>
				<option value="3x4">Tablet (4x3) - Portrait</option>
				<option value="13x6">Phone (6x13) - Landscape</option>
				<option value="6x13">Phone (6x13) - Portrait</option>
			</select>
		</div>
		<div>
			<input type="checkbox" name="custom" id="custom-checkbox" />
			<label for="custom">Custom width and height</label>
		</div>
		<div id="custom" class="custom">
			<label for="width">Width</label>
			<input type="number" name="width" value="6" min="1" max="99" />
			<label for="height">Height</label>
			<input type="number" name="height" value="13" min="1" max="99" />
		</div>
		<div>
			<label for="bigger-boxes">Number of bigger boxes</label>
			<input
				type="number"
				name="bigger-boxes"
				value="5"
				min="0"
				max="99"
			/>
		</div>
		<div>
			<input type="checkbox" name="random" checked />
			<label for="random">Random sort</label>
		</div>
		<div>
			<input type="checkbox" name="repeats" checked />
			<label for="repeats">Remove repeated images</label>
		</div>
		<div>
			<input type="checkbox" name="fill" checked />
			<label for="fill">Fill with duplicates</label>
		</div>
		<p>Image Quality</p>
		<div class="size-selector">
			<input type="radio" id="low" name="size" value="low" />
			<label for="small">Low</label><br />
			<input
				type="radio"
				id="medium"
				name="size"
				value="medium"
				checked
			/>
			<label for="medium">Medium</label><br />
			<input type="radio" id="high" name="size" value="high" />
			<label for="large">High</label>
		</div>
		<button id="playlist-submit" type="submit">Generate Image</button>
		<button id="download-button" type="button" v-on:click="downloadImage" :disabled="collage64Image == ''">Download</button>
	</form>
</template>

<script>
import PlaylistSelector from "@/components/Collage/PlaylistSelector.vue";

export default {
	components: {
		PlaylistSelector,
	},
	methods: {
		submitForm(event) {
			// console.log(event);
			this.$emit("collage-submit", event.target);
		},
		downloadImage() {
			const a = document.createElement("a"); //Create <a>
			a.href = this.collage64Image;
			a.download = "collage.png"; //File name Here
			a.click(); //Downloaded file
		}
	},
	props: ['collage64Image']
};
</script>
