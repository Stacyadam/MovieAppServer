const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isMovieOwner } = require('./authorization');

module.exports = {
	Query: {
		movies: (parent, args, { models }) => {
			return models.Movie.findAll();
		},
		movie: (parent, args, { models }) => {
			const { id } = args;
			return models.Movie.findById(id);
		}
	},

	Mutation: {
		createMovie: combineResolvers(isAuthenticated, (parent, args, { models, me }) => {
			const { name, rank } = args;
			return models.Movie.create({
				name,
				rank,
				userId: me.id
			});
		}),

		deleteMovie: combineResolvers(isAuthenticated, isMovieOwner, (parent, args, { models }) => {
			const { name } = args;
			return models.Movie.destroy({ where: { name } });
		})
	},

	Movie: {
		user: (message, args, { models }) => {
			return models.User.findById(message.userId);
		}
	}
};
