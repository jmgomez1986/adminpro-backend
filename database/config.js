const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.db_cnn, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('DB online');
	} catch (error) {
		console.log(error);
		throw new Error('Error a la hora de iniciar la BD');
	}
};

module.exports = {
	dbConnection,
};
