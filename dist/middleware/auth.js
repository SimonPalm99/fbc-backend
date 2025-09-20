"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireLeaderOrAdmin = requireLeaderOrAdmin;
// Tom modul för att undvika importfel
function authenticateToken(req, res, next) { next(); }
function requireLeaderOrAdmin(req, res, next) { next(); }
