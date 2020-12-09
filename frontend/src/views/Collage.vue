<template>
	<div>
		<h1>Collage</h1>
		<router-link to="/">Home</router-link>
		<CollageForm v-on:collage-submit="collageSubmit" v-bind:collage64Image="collage64Image" />
		<!-- <CollageCanvas /> -->
		<canvas id="collage-canvas" />
	</div>
</template>

<script>
import CollageForm from "@/components/Collage/CollageForm.vue";
// import CollageCanvas from "@/components/Collage/CollageCanvas.vue";
import canvasFormService from "../model/canvasFormService.js";

export default {
	components: {
		CollageForm,
		// CollageCanvas,
	},
	data: () => {
		return {
			collage64Image: ""
		};
	},
	methods: {
		async collageSubmit(form) {
			const img64 = await canvasFormService.formHandler(form);
			this.collage64Image = img64;
			console.log(this.collage64Image);
		},
	},
};
</script>

<style>
canvas {
	border: 1px solid black;
}
</style>
