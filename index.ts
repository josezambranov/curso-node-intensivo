
import { createServer } from "http";
import cors from "cors";
import { authRouter, characterRouter } from "./routers";
import config from "./config";
const corsMiddleware = cors();

const server = createServer(async (req, res) => {
    corsMiddleware(req, res, async () => {
        res.setHeader("Content-Type", "application/json");
        try {
            if (req.url?.startsWith("/auth")) {
                await authRouter(req, res)
            } else if (req.url?.startsWith("/character")) {
                await characterRouter(req, res)

            } else {
                res.statusCode = 404
                res.end(JSON.stringify({ message: "Endpoint not found" }))
            }
        } catch (_err) {
            console.error(_err)
            res.statusCode = 500
            res.end(JSON.stringify({ message: "Internal server error" }))
        }
    });
})

server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})