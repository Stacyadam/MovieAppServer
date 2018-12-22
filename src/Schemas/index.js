const { gql } = require('apollo-server-express');

const userSchema = require('./User');
const movieSchema = require('./Movie');

const baseSchema = gql`
	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`;

module.exports = [baseSchema, userSchema, movieSchema];
