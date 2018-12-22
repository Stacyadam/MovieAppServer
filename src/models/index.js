const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	host: 'ec2-107-20-237-78.compute-1.amazonaws.com',
	dialect: 'postgres',
	dialectOptions: {
		ssl: true
	}
});

const models = {
	User: sequelize.import('./User'),
	Movie: sequelize.import('./Movie')
};

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = {
	models,
	sequelize
};
