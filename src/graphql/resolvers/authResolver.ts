import { authenticateUser, hashPassword, verifyPassword } from '~/utils/auth';
import { db } from '~/utils/prisma';
import { createSession, removeSession } from '~/utils/sessions';
import { builder } from '../builder';

// Every GraphQL query will be made through the `me` query field.
builder.queryField('me', (t) =>
	t.prismaField({
		type: 'User',
		nullable: true,
		// The "me" field can be queried even if the user is not logged in
		skipTypeScopes: true,
		resolve: (query, _root, _args, { session }) => {
			if (!session?.userPk) {
				return null;
			}

			return db.user.findUnique({
				...query,
				where: {
					pk: session.userPk,
				},
				rejectOnNotFound: true,
			});
		},
	}),
);

const LoginInput = builder.inputType('LoginInput', {
	fields: (t) => ({
		email: t.string({ validate: { email: true } }),
		password: t.string({ validate: { minLength: 8 } }),
	}),
});

builder.mutationField('login', (t) =>
	t.prismaField({
		type: 'User',
		// The parent auth scope (for the Mutation type) is for authenticated users,
		// so we will need to skip it.
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true,
		},
		args: {
			input: t.arg({ type: LoginInput }),
		},
		resolve: async (_query, _root, { input }, { ironSession }) => {
			const user = await authenticateUser(input.email, input.password);
			await createSession(ironSession, user);

			return user;
		},
	}),
);

const SignUpInput = builder.inputType('SignUpInput', {
	fields: (t) => ({
		name: t.string({
			validate: {
				minLength: 1,
				maxLength: 100,
			},
		}),
		email: t.string({ validate: { email: true } }),
		password: t.string({ validate: { minLength: 8 } }),
	}),
});

builder.mutationField('signUp', (t) =>
	t.prismaField({
		type: 'User',
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true,
		},
		args: {
			input: t.arg({ type: SignUpInput }),
		},
		resolve: async (_query, _root, { input }, { ironSession }) => {
			const user = await db.user.create({
				data: {
					name: input.name,
					email: input.email,
					password: await hashPassword(input.password),
				},
			});

			await createSession(ironSession, user);

			return user;
		},
	}),
);
