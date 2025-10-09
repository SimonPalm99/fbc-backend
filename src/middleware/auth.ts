import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	// Läs token från cookie eller Authorization-header
	let token = null;
	if (req.cookies && req.cookies.fbc_access_token) {
		token = req.cookies.fbc_access_token;
	} else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return res.status(401).json({ error: 'Ingen token hittades' });
	}
	try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
			if (typeof decoded === 'object' && 'id' in decoded) {
				req.user = (decoded as any).id;
				next();
			} else {
				return res.status(401).json({ error: 'Ogiltig token payload' });
			}
	} catch (err) {
		return res.status(401).json({ error: 'Ogiltig eller utgången token' });
	}
}

import User from '../models/User';

export async function requireLeaderOrAdmin(req: any, res: any, next: any) {
	try {
		// Hämta användare från databas
		const userId = req.user;
		if (!userId) return res.status(401).json({ error: 'Ingen användare' });
		const user = await User.findById(userId);
		if (!user) return res.status(401).json({ error: 'Användaren finns inte' });
		if (user.role === 'leader' || user.role === 'admin' || user.role === 'coach') {
			return next();
		}
		return res.status(403).json({ error: 'Endast ledare eller admin kan utföra denna åtgärd' });
	} catch (err) {
		return res.status(500).json({ error: 'Serverfel vid behörighetskontroll' });
	}
}
export type AuthRequest = any;
