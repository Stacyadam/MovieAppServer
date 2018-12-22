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
			type: DataTypes.TINYINT,
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
