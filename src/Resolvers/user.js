const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const createToken = async (user, secret, expiresIn) => {
	const { id, email, role } = user;
	return await jwt.sign({ id, email, role }, secret, { expiresIn });
};

module.exports = {
	Query: {
		users: (parent, args, { models }) => {
			return models.User.findAll();
		},
		user: (parent, args, { models }) => {
			const { id } = args;
			return models.User.findById(id);
		}
	},

	Mutation: {
		signUp: async (parent, args, { models, secret }) => {
			const { email, password } = args;

			const user = await models.User.create({
				email,
				password
			});

			return { token: createToken(user, secret, '30d') };
		},

		signIn: async (parent, args, { models, secret }) => {
			const { email, password } = args;

			const user = await models.User.findOne({ where: { email } });

			if (!user) {
				throw new UserInputError('Email or password are incorrect.');
			}

			const isValid = await user.validatePassword(password);
			if (!isValid) {
				throw new UserInputError('Email or password are incorrect.');
			}

			return { token: createToken(user, secret, '30d') };
		}
	},

	User: {
		movies: (user, args, { models }) => {
			return models.Movie.findAll({
				where: {
					userId: user.id
				}
			});
		}
	}
};
