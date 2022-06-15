import crypto from 'crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';
import { db } from './prisma';
import { ValidationError } from '~/graphql/errors';
import { User } from '@prisma/client';

// Cost factor of the bcrypt hash.
const COST_FACTOR = 12;

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16);

	const key = await bcrypt({
		password,
		salt,
		costFactor: COST_FACTOR,
		outputType: 'encoded',
	});

	return key;
}

export function verifyPassword(
	hash: string,
	password: string,
): Promise<boolean> {
	return bcryptVerify({
		password,
		hash,
	});
}

export async function authenticateUser(
	email: string,
	password: string,
): Promise<User> {
	const user = await db.user.findFirst({
		where: {
			email: {
				equals: email,
				mode: 'insensitive',
			},
		},
	});

	// If the email does not exists in the database, reject the authenticate request.
	if (!user || !user.password) {
		throw new ValidationError('Email not found', {
			email: 'Email not found',
		});
	}

	// If the password is invalid, reject the authenticate request.
	if (!(await verifyPassword(user.password, password))) {
		throw new ValidationError('Invalid password.', {
			password: 'Password is incorrect',
		});
	}

	// Hash should be: $2b$costFactor$hash
	const [, _algo, costFactorString] = user.password.split('$');

	// NOTE: This never practically should happen, but we want to error out in the event that it does:
	if (!costFactorString) {
		throw new Error('Unknown password format.');
	}

	// If the password was hashed with a work factor that is not the same as the current work factor,
	// we will seamlessly upgrade it to the updated work factor:
	const costFactor = parseInt(costFactorString);
	if (costFactor !== COST_FACTOR) {
		const improvedHash = await hashPassword(password);
		await db.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: improvedHash,
			},
		});
	}

	// If the login is successfull and there are password reset request, we consider all of them invalid,
	// so we delete them from the database.
	await db.passwordReset.deleteMany({
		where: {
			userPk: user.pk,
		},
	});

	return user;
}
