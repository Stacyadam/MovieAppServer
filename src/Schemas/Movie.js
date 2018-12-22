const { gql } = require('apollo-server-express');

module.exports = gql`
	extend type Query {
		movie(name: String!): Movie!
		movies: [Movie!]!
	}

	extend type Mutation {
		createMovie(name: String!, rank: Int!): Movie!
		deleteMovie(name: String!): Boolean!
	}

	type Movie {
		id: ID!
		name: String!
		rank: Int!
		watched: Boolean!
		user: User!
	}
`;
