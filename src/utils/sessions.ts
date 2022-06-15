import { Session, User } from '@prisma/client';
import { IronSessionOptions, getIronSession, IronSession } from 'iron-session';
import { IncomingMessage, ServerResponse } from 'http';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { db } from './prisma';

const SESSION_TTL = 15 * 24 * 3060;

declare module 'iron-session' {
	interface IronSessionData {
		// NOTE: The database
		sessionId?: string | null;
	}
}

interface CachedSession {
	session: Session | null;
	ironSession: IronSession;
}

if (!process.env.COOKIE_SECRET) {
	console.warn('No `COOKIE_SECRET` environment variable was found.');
}

const SESSION_OPTIONS: IronSessionOptions = {
	password: {
		1: process.env.COOKIE_SECRET as string,
	},
	cookieName: 'bearnetic.session.1',
	ttl: SESSION_TTL,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		httpOnly: true,
	},
};

export async function createSession(
	ironSession: IronSession,
	user: User,
): Promise<Session> {
	const session = await db.session.create({
		data: {
			userPk: user.pk,
			expiresAt: addSeconds(new Date(), SESSION_TTL),
		},
	});

	ironSession.sessionId = session.id;

	await ironSession.save();

	return session;
}

export async function removeSession(
	ironSession: IronSession,
	session?: Session | null,
): Promise<void> {
	ironSession.destroy();
	await ironSession.save();

	if (session) {
		await db.session.delete({ where: { id: session.id } });
	}
}

const sessionCache = new WeakMap<IncomingMessage, CachedSession>();

export async function resolveSession(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<CachedSession> {
	const cachedSession = sessionCache.get(req);
	if (cachedSession) {
		return cachedSession;
	}

	const ironSession = await getIronSession(req, res, SESSION_OPTIONS);
	const sessionId = ironSession.sessionId;

	let session: Session | null = null;

	if (sessionId) {
		session = await db.session.findFirst({
			where: {
				id: sessionId,
				expiresAt: {
					gte: new Date(),
				},
			},
		});

		if (session) {
			// If we resolve a session in the request, we'll automatically renew it
			// if 25% of the session has elapsed.
			const shouldRefreshSession =
				differenceInSeconds(session.expiresAt, new Date()) < 0.75 * SESSION_TTL;

			if (shouldRefreshSession) {
				await db.session.update({
					where: {
						id: session.id,
					},
					data: {
						expiresAt: addSeconds(new Date(), SESSION_TTL),
					},
				});

				await ironSession.save();
			}
		} else {
			// There was no session found in the DB, but one was found in the session store.
			// This means that the browser is out-of-date with the server. In this case,
			// we just destroy the session entirely.
			ironSession.destroy();
			await ironSession.save();
		}
	}

	sessionCache.set(req, { session, ironSession });

	return { session, ironSession };
}
