import type { IncomingMessage, ServerResponse } from "http";
import { addRevokeToken, authSchema, createUser, findUserByEmail, HttpMethod, revokeUserkeToken, validatePassword } from "../models";
import { safeParse } from "valibot";
import { parseBody } from "../utils/parseBody";
import { sign } from "jsonwebtoken";
import config from "../config";
import type { AuthenticatedRequest } from "../middleware/authentication";


export const authRouter = async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req

    if (url === "/auth/register" && method === HttpMethod.POST) {
        const body = await parseBody(req)
        const result = safeParse(authSchema, body);
        if (!result.success) {
            res.statusCode = 400
            res.end(JSON.stringify({ bessage: 'Bad Request' }))
            return
        }

        const { email, password } = body;
        try {
            const user = await createUser(email, password)
            res.statusCode = 201
            res.end(JSON.stringify(user));
            return
        } catch (err) {
            if (err instanceof Error) {
                res.end(JSON.stringify({ message: err.message }))
            } else {
                res.end(JSON.stringify({ message: 'Internal Server Error' }))
            }
        }
        return
    }

    if (url === "/auth/login" && method === HttpMethod.POST) {
        const body = await parseBody(req)
        console.log("body: ",body)
        const result = safeParse(authSchema, body);
        if (result.issues) {
            res.statusCode = 400
            res.end(JSON.stringify({ bessage: 'Bad Request' }))
        }

        const { email, password } = body;
        const user = findUserByEmail(email)
        if (!user || !(await validatePassword(user, password))) {
            res.statusCode = 401
            res.end(JSON.stringify({ message: 'invalid email or' }))
            return
        }
        const accessToken = sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: '1h' }
        )

        const refreshToken = sign(
            {
                id: user.id
            },
            config.jwtSecret,
            { expiresIn: '1d' }
        )
        user.refreshToken = refreshToken
        res.end(JSON.stringify({ accessToken, refreshToken }))
        return
    }

    if (url === "/auth/logout" && method === HttpMethod.POST) {
        const token = req.headers["authorization"]?.split(" ")[1]
        if (token) {
            addRevokeToken(token)

            const formattedReq = req as AuthenticatedRequest;
            if (
                formattedReq.user && typeof formattedReq.user === "object" && "id" in formattedReq.user
            ) {
                const result = revokeUserkeToken(formattedReq.user.email)
                if (!result) {
                    res.statusCode = 403
                    res.end(JSON.stringify({ message: 'Forbidden' }))
                }
            }
            res.end(JSON.stringify({ message: "Logged out" }))
            return
        }

    }
    res.statusCode = 404
    res.end(JSON.stringify({message: "Endpoind Not Found"}))
}