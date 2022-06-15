import { schema } from '~/graphql/index';
import { Context, createGraphQLContext } from '~/graphql/builder';
import {
	getGraphQLParameters,
	processRequest,
	renderGraphiQL,
	shouldRenderGraphiQL,
} from 'graphql-helix';
import { NextApiHandler } from 'next';
import { ExecutionResult, GraphQLError } from 'graphql';
import { IncomingHttpHeaders } from 'http';
import { resolveSession } from '~/utils/sessions';

interface GraphQLRequest {
	body?: any;
	headers: IncomingHttpHeaders;
	method: string;
	query: any;
}

function getGraphQLCode(error: Error & { code?: number }) {
	return error.code ?? error.name === 'NotFoundError' ? 404 : null;
}

function formatResult(result: ExecutionResult) {
	const formattedResult: ExecutionResult = {
		data: result.data,
	};

	if (result.errors) {
		formattedResult.errors = result.errors.map((error) => {
			return new GraphQLError(error.message, {
				nodes: error.nodes,
				source: error.source,
				positions: error.positions,
				path: error.path,
				originalError: error.originalError,
				extensions: {
					code: getGraphQLCode(error.originalError as any),
					path: (error.originalError as any)?.path,
					...(error.originalError as any)?.extensions,
				},
			});
		});
	}

	return formattedResult;
}

const handler: NextApiHandler = async (req, res) => {
	// For POST requests, we require a custom header: X-CSRF-Trick.
	// This helps ensure that cross-domain requests can't be issued.
	console.log(req.headers);
	if (req.method === 'POST' && req.headers['x-csrf-trick'] !== 'Bearnetic') {
		res.status(400);
		res.end('Invalid request');
		return;
	}

	const { session, ironSession } = await resolveSession(req, res);

	try {
		const request: GraphQLRequest = {
			headers: req.headers,
			method: req.method ?? 'GET',
			query: req.query,
			body: req.body,
		};

		if (shouldRenderGraphiQL(request)) {
			res.setHeader('Content-Type', 'text/html');
			res.send(
				renderGraphiQL({
					endpoint: '/api/graphql',
					headers: JSON.stringify({
						'X-CSRF-Trick': 'Bearnetic',
					}),
				}),
			);
		} else {
			const { operationName, query, variables } = getGraphQLParameters(request);
			console.log(schema);
			const result = await processRequest<Context>({
				operationName,
				query,
				variables,
				request,
				schema,
				contextFactory: () =>
					createGraphQLContext(req, res, ironSession, session),
			});

			if (result.type !== 'RESPONSE') {
				throw new Error(`Unsupported response type: "${result.type}"`);
			}

			result.headers.forEach(({ name, value }) => res.setHeader(name, value));
			res.status(result.status);
			res.json(formatResult(result.payload));
		}
	} catch (err) {
		res.status(500);
		res.end(String(err));
	}
};

export default handler;
