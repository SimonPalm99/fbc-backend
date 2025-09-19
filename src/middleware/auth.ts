// Tom modul för att undvika importfel
export function authenticateToken(req: any, res: any, next: any) { next(); }
export function requireLeaderOrAdmin(req: any, res: any, next: any) { next(); }
export type AuthRequest = any;
