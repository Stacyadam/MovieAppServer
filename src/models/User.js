const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			unique: {
				msg: 'Email already exists.'
			},
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [7, 42]
			}
		}
	});

	User.associate = models => {
		User.hasMany(models.Movie, { onDelete: 'CASCADE' });
	};

	User.beforeCreate(async user => {
		user.password = await user.generatePasswordHash();
	});

	User.prototype.generatePasswordHash = async function() {
		const saltRounds = 10;
		return await bcrypt.hash(this.password, saltRounds);
	};

	User.prototype.validatePassword = async function(password) {
		return await bcrypt.compare(password, this.password);
	};

	return User;
};
