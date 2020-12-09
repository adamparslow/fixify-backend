import spotifyService from "@/model/spotifyService.js";
import canvasEngine from "@/model/canvasEngine.js";
import imageGenerator from "@/model/imageGenerator.js";

async function formHandler(form) {
	const formData = processForm(form);

	// // Get image data
	// const playlist = playlistInfo.filter(
	// 	(playlist) => playlist.name === formData.playlist
	// )[0];
	let images = await spotifyService.getPlaylistCoverArt(
		formData.playlist,
		getSize(formData.size)
	);

	canvasEngine.setDimensions(
		formData.width,
		formData.height,
		images[0].height / 2
	);

	// Remove repeated images
	if (formData.repeats) {
		images = removeDuplicates(images);
	}

	// Fill with duplicates
	if (formData.fill) {
		images = fillWithDuplicates(images, formData.width * formData.height);
	}

	// Randomly sort the list
	if (formData.random) {
		images = shuffle(images);
	}

	// Remove excess images
	let numberOfImages = formData.width * formData.height;
	images.splice(numberOfImages);

	// // Generate image
	const collage = await imageGenerator.generate(
		images,
		formData.width,
		formData.height,
		formData["bigger-boxes"]
	);
	return await collage.getBase64Async(window.Jimp.MIME_PNG);

	// const downloadButton = document.getElementById("download-button");
	// downloadButton.disabled = false;
	// downloadButton.onclick = () => {
	// 	downloadFile(collage64, "image.png");
	// };
}

function processForm(form) {
	const preFormData = new FormData(form);

	const formData = {};
	for (var pair of preFormData.entries()) {
		formData[pair[0]] = pair[1];
	}

	handleCustomDimensions(formData);
	// parsePlaylist(formData);

	return formData;
}

function handleCustomDimensions(formData) {
	if (!formData.custom) {
		const [width, height] = formData.ratio.split("x");
		formData.width = width;
		formData.height = height;
	}
}

function getSize(sizeWord) {
	switch (sizeWord) {
		case "low":
			return 2;
		case "medium":
			return 1;
		case "high":
			return 0;
	}
}

// function parsePlaylist(formData) {
// 	formData.playlist = JSON.parse(formData.playlist);
// }

// // TODO: move download data into the components
// function downloadFile(data, fileName) {
// 	const a = document.createElement("a"); //Create <a>
// 	a.href = data;
// 	a.download = fileName; //File name Here
// 	a.click(); //Downloaded file
// }

function removeDuplicates(images) {
	images = removeUndefined(images);
	return (
		images
			.map((image) => image.url)
			// Check if the urls first index matches the current index, if not, give undefined, otherwise return index
			.map((url, index, final) => final.indexOf(url) === index && index)
			// Removed undefined
			.filter((index) => images[index])
			// Take new list of indexes and produce new array
			.map((index) => images[index])
	);
}

function removeUndefined(images) {
	return images.filter((image) => image);
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function fillWithDuplicates(images, finalSize) {
	let i = 0;
	let originalLen = images.length;
	let newImages = shuffle([...images]);
	while (images.length < finalSize) {
		images.push(newImages[i % originalLen]);
		i++;
	}

	return images;
}

// function advancedClickHandler() {
// 	const box = document.getElementById("advanced-box");
// 	box.style.display = box.style.display === "block" ? "none" : "block";
// }

// function toggleCustomDisplay(event) {
// 	const customDiv = document.getElementById("custom");
// 	const ratioField = document.getElementById("ratio");
// 	const checked = event.target.checked;
// 	customDiv.style.display = checked ? "block" : "none";
// 	ratioField.disabled = checked;
// }

export default {
	formHandler,
};
