import tokenHandler from "./tokenHandler.js";

// TODO: replace in .env
const urlStart = "http://localhost:3000"

const getMegamixRegistrationStatus = async () => {
	const url = `${urlStart}/megamix/register?refresh_token=${tokenHandler.getRefreshToken()}`;

	const response = await fetch(url);
	return await response.json();
};

const registerForMegamix = async () => {
	const url = urlStart + "/megamix/register";
	const refreshToken = tokenHandler.getRefreshToken();
	const body = {
		refresh_token: refreshToken,
	};

	await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};

const deregisterFromMegamix = async () => {
	const url = urlStart + "/megamix/register";
	const refreshToken = tokenHandler.getRefreshToken();
	const body = {
		refresh_token: refreshToken,
	};

	await fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};

const createMegamix = async () => {
	const url = urlStart + "/megamix/generate";
	const refreshToken = tokenHandler.getRefreshToken();
	const body = {
		refresh_token: refreshToken,
	};

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const json = await response.json();
	return json.url;
};

export default {
	getMegamixRegistrationStatus,
	registerForMegamix,
	deregisterFromMegamix,
	createMegamix,
};
