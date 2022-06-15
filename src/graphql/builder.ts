import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ValidationPlugin from '@pothos/plugin-validation';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Session } from '@prisma/client';
import { db } from '~/utils/prisma';
import { IronSession } from 'iron-session';

export interface Context {
	req: IncomingMessage;
	res: OutgoingMessage;
	ironSession: IronSession;
	session?: Session | null;
}

export function createGraphQLContext(
	req: IncomingMessage,
	res: OutgoingMessage,
	ironSession: IronSession,
	session?: Session | null,
): Context {
	return {
		req,
		res,
		ironSession,
		session,
	};
}

export const builder = new SchemaBuilder<{
	// We change the defaults for arguments to be `required`. Any non-required
	// argument can be set to `required: false`.
	DefaultInputFieldRequiredness: true;
	PrismaTypes: PrismaTypes;
	Context: Context;
	Scalars: {
		// We modify the types for the `ID` type to denote that it's always a string when it comes in.
		ID: { Input: string; Output: string | number };
		DateTime: { Input: Date; Output: Date };
	};
	// Define the shape of the auth scopes that we'll be using:
	AuthScopes: {
		public: boolean;
		user: boolean;
		unauthenticated: boolean;
	};
}>({
	defaultInputFieldRequiredness: true,
	plugins: [
		SimpleObjectsPlugin,
		ScopeAuthPlugin,
		ValidationPlugin,
		PrismaPlugin,
	],
	authScopes: async ({ session }) => ({
		public: true,
		user: !!session,
		unauthenticated: !session,
	}),
	prisma: { client: db },
});

// This initializes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({
	// Set the default auth scope to be authenticated users:
	authScopes: {
		user: true,
	},
});

builder.mutationType({
	// Set the default auth scope to be authenticated users:
	authScopes: {
		user: true,
	},
});

// Provide the custom DateTime scalar that allows dates to be transmitted over GraphQL:
builder.scalarType('DateTime', {
	serialize: (date) => date.toISOString(),
	parseValue: (date) => {
		if (typeof date !== 'string') {
			throw new Error('Unknown date value.');
		}

		return new Date(date);
	},
});
