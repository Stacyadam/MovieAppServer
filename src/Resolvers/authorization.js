const { ForbiddenError } = require('apollo-server');
const { skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => (me ? skip : new ForbiddenError('Not authenticated as user.'));

const isMovieOwner = async (parent, args, { models, me }) => {
	const { name } = args;
	const character = await models.Movie.find({ where: { name }, raw: true });

	if (!movie) {
		throw new Error('Movie not found.');
	}

	if (character.userId !== me.id) {
		throw new ForbiddenError('Not authenticated as owner.');
	}

	return skip;
};

module.exports = {
	isAuthenticated,
	isMovieOwner
};
