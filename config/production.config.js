var config = {
	logentries: {
		token: process.env.LOGENTRIES_TOKEN
	},

	seismo: {
		app: 'airpair-production',
		options: {
			server: 'https://airpair.com',
			credentials: {
				username: process.env.SEISMO_USERNAME,
				password: process.env.SEISMO_PASSWORD
			}
		}
	}
};

module.exports = config;
