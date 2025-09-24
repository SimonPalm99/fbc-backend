"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireLeaderOrAdmin = requireLeaderOrAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    // Läs token från cookie eller Authorization-header
    let token = null;
    if (req.cookies && req.cookies.fbc_access_token) {
        token = req.cookies.fbc_access_token;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'Ingen token hittades' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        if (typeof decoded === 'object' && 'id' in decoded) {
            req.user = decoded.id;
            next();
        }
        else {
            return res.status(401).json({ error: 'Ogiltig token payload' });
        }
    }
    catch (err) {
        return res.status(401).json({ error: 'Ogiltig eller utgången token' });
    }
}
function requireLeaderOrAdmin(req, res, next) { next(); }
