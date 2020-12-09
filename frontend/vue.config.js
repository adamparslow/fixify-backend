module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
	configureWebpack: {
		externals: {
			Jimp: 'jimp'
		}
	}
};
