const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isMovieOwner } = require('./authorization');

module.exports = {
	Query: {
		movies: (parent, args, { models }) => {
			return models.Movie.findAll({ where: { watched: false } });
		},
		watchedMovies: (parent, args, { models }) => {
			return models.Movie.findAll({ where: { watched: true } });
		},
		movie: async (parent, args, { models }) => {
			const { name } = args;
			const movie = await models.Movie.findOne({ where: { name } });

			if (!movie) throw new Error('The movie was not found.');

			return movie;
		}
	},

	Mutation: {
		createMovie: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
			const { name, rank } = args;
			return await models.Movie.create({
				name,
				rank,
				userId: me.id
			});
		}),

		deleteMovie: combineResolvers(isAuthenticated, isMovieOwner, async (parent, args, { models }) => {
			const { name } = args;
			const deleted = await models.Movie.findOne({ where: { name } });
			await models.Movie.destroy({ where: { name } });

			return deleted;
		}),

		rateMovie: combineResolvers(isAuthenticated, async (parent, args, { models }) => {
			const { name, stars, comment } = args;
			//TODO Find movie record, see if it has a stars value, take the average with the incoming stars request
			const updateObj = {
				stars,
				comment,
				watched: true
			};
			const update = await models.Movie.update(updateObj, { where: { name } });
			if (update[0] === 0) {
				throw new Error('No movie found with that name.');
			}

			return await models.Movie.findOne({ where: { name } });
		})
	},

	Movie: {
		user: (message, args, { models }) => {
			return models.User.findById(message.userId);
		}
	}
};
