function getAccessToken() {
	return localStorage.getItem("access_token");
}

function getRefreshToken() {
	return localStorage.getItem("refresh_token");
}

function setAccessToken(token) {
	localStorage.setItem("access_token", token);
}

function setRefreshToken(token) {
	localStorage.setItem("refresh_token", token);
}

export default {
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken,
};
