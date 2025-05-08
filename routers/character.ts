import type { IncomingMessage, ServerResponse } from "http";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/authentication";
import { addCharacter, CharacterSchema, deleteCharacter, getAllCharacters, getCharacterById, HttpMethod, Role, updateCharacter, type Character } from "../models";
import { authorizeRoles } from "../middleware/authorization";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";

export const characterRouter = async (
    req: IncomingMessage, res: ServerResponse
) => {
    const { method, url } = req

    if (!await authenticateToken(req as AuthenticatedRequest, res)) {
        res.statusCode = 401
        res.end(JSON.stringify({ message: 'Unauthorized' }))
        return
    }
    if (url === "/characters" && method === HttpMethod.GET) {
        const characters = getAllCharacters();
        res.statusCode = 200
        res.end(JSON.stringify(characters))
        return;
    }
    if (url === "/characters/" && method === HttpMethod.GET) {
        const id = parseInt(url.split("/").pop() as string, 10);
        const character = getCharacterById(id);
        if (!character) {
            res.statusCode = 404
            res.end(JSON.stringify({ message: 'Character not found' }))
            return
        }
        res.statusCode = 200
        res.end(JSON.stringify(character));
        return;
    }
    if (url === "/characters" && method === HttpMethod.POST) {
        if (!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: 'Forbidden' }))
            return
        }
        const body = await parseBody(req)
        const result = safeParse(CharacterSchema, body)
        if (result.issues) {
            res.statusCode = 400
            res.end(JSON.stringify({ message: result.issues }))
            return
        }

        const character: Character = body;
        addCharacter(character);
        res.statusCode = 201
        res.end(JSON.stringify(character))
        return
    }

    if (url?.startsWith("/characters/") && method === HttpMethod.PATCH) {
        if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: 'Forbidden' }))
            return
        }
        const id = parseInt(url.split("/").pop() as string, 10);
        const body = await parseBody(req)
        const character: Character = body;
        const updateCharacters = updateCharacter(id, character)
        if (!updateCharacters) {
            res.statusCode = 404
            res.end(JSON.stringify({ message: 'Character not found' }))
            return
        } else {
            res.statusCode = 200
            res.end(JSON.stringify(updateCharacters))
        }
        return

    }
    if(url?.startsWith("/characters/") && method === HttpMethod.DELETE) {
        if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: 'Forbidden' }))
            return
        }
        const id = parseInt(url.split("/").pop() as string, 10);
       const success = deleteCharacter(id)
        if (!success) {
            res.statusCode = 404
            res.end(JSON.stringify({ message: 'Character not found' }))
            return
        }else {
            res.statusCode = 204
            res.end(JSON.stringify({ message: 'Character deleted' }))
        }
        return
    }
    res.statusCode = 404
    res.end(JSON.stringify({message: "Endpoind Not found"}))
    
}
