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
			await models.Movie.create({
				name,
				rank,
				userId: me.id
			});

			const watchedList = await models.Movie.findAll({ where: { watched: false } });
			return watchedList;
		}),

		deleteMovie: combineResolvers(isAuthenticated, isMovieOwner, async (parent, args, { models }) => {
			const { name } = args;
			await models.Movie.destroy({ where: { name } });

			return await models.Movie.findAll();
		}),

		rateMovie: combineResolvers(isAuthenticated, async (parent, args, { models }) => {
			const { name, stars } = args;
			//TODO Find movie record, see if it has a stars value, take the average with the incoming stars request
			const update = await models.Movie.update({ stars, watched: true }, { where: { name } });

			if (update[0] === 0) {
				throw new Error('No movie found with that name.');
			}

			const watchedList = await models.Movie.findAll({ where: { watched: true } });
			return watchedList;
		})
	},

	Movie: {
		user: (message, args, { models }) => {
			return models.User.findById(message.userId);
		}
	}
};
