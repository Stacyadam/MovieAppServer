const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Query {
		movie(name: String!): Movie!
		movies: [Movie!]!
		watchedMovies: [Movie!]!
	}

	extend type Mutation {
		createMovie(name: String!, rank: Int!): Movie!
		deleteMovie(name: String!): [Movie!]!
		rateMovie(name: String!, stars: Float!): [Movie!]!
	}

	type Movie {
		id: ID!
		name: String!
		stars: Float!
		rank: Int!
		watched: Boolean!
		user: User!
	}
`;
