module.exports = (sequelize, DataTypes) => {
	const Movie = sequelize.define('movie', {
		name: {
			type: DataTypes.STRING,
			unique: {
				msg: 'That movie already exists in the list.'
			},
			validate: {
				notEmpty: {
					args: true,
					msg: 'Please provide a movie name.'
				}
			}
		},
		rank: {
			type: DataTypes.INTEGER,
			validate: {
				min: {
					args: [1],
					msg: 'Movie rank must be higher than 0'
				},
				max: {
					args: [10],
					msg: 'Movie rank must be lower than 10'
				}
			}
		},
		stars: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
			validate: {
				min: {
					args: [0],
					msg: 'Movie stars must not be negative'
				},
				max: {
					args: [5],
					msg: 'Movie stars must be lower than 5'
				}
			}
		},
		watched: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});

	Movie.associate = models => {
		Movie.belongsTo(models.User);
	};

	return Movie;
};
