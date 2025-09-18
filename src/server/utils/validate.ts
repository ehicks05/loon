import type { Request, Response } from 'express';
import type { Session, User } from 'lucia';
import { lucia } from '../lucia/lucia.js';

export async function validateRequest(
	req: Request,
	res: Response,
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}
	const result = await lucia.validateSession(sessionId);
	if (result.session?.fresh) {
		res.header(
			'Set-Cookie',
			lucia.createSessionCookie(result.session.id).serialize(),
		);
	}
	if (!result.session) {
		res.header('Set-Cookie', lucia.createBlankSessionCookie().serialize());
	}
	return result;
}
