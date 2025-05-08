import type { IncomingMessage, ServerResponse } from "http";
import { type JwtPayload, verify } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import config from "../config";

/**
 * Extends the IncomingMessage interface to include an optional user property.
 */
export interface AuthenticatedRequest extends IncomingMessage {
    /**
     * The decoded JWT payload or string representing the authenticated user.
     */
    user?: JwtPayload | string;
}

/**
 * Middleware to authenticate a JWT token from the request headers.
 * @param {AuthenticatedRequest} req - The incoming HTTP request with optional user information.
 * @param {ServerResponse} res - The HTTP response object.
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: ServerResponse
): Promise<boolean> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return false;
    }

    if (isTokenRevoked(token)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Forbidden' }));
        return false;
    }

    try {
        const decoded = verify(token, config.jwtSecret);
        req.user = decoded;
        return true;
    } catch (_err) {
        console.error(_err);
        res.statusCode = 403;
        res.end(JSON.stringify({ message: 'Forbidden' }));
        return false;
    }
}