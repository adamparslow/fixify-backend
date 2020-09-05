import tokenHandler from "./tokenHandler.js";

const getMegamixRegistrationStatus = async () => {
	const url = `http://localhost:8080/megamix/register?refresh_token=${tokenHandler.getRefreshToken()}`;

	const response = await fetch(url);
	return await response.json();
};

const registerForMegamix = async () => {
	const url = "http://localhost:8080/megamix/register";
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
	const url = "http://localhost:8080/megamix/register";
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
	const url = "http://localhost:8080/megamix/generate";
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

export default {
	getMegamixRegistrationStatus,
	registerForMegamix,
	deregisterFromMegamix,
	createMegamix,
};
