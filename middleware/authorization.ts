import type { ServerResponse } from "http"
import type { AuthenticatedRequest } from "./authentication"
import type { User } from "../models"

/**
 * Middleware to authorize users based on their roles.
 * @param {...string[]} roles - The roles allowed to access the resource.
 * @returns {(req: AuthenticatedRequest, res: ServerResponse) => Promise<boolean>} 
 * A function that checks if the user's role is authorized.
 */

export const authorizeRoles = (...roles:string[]) =>{
    return async (
        req:AuthenticatedRequest,
        res:ServerResponse,

    ):Promise<boolean>=>{
        const userRole = (req.user as User).role
        if(!userRole||!roles.includes(userRole)){
            res.statusCode = 403
            res.end(JSON.stringify({message:'Forbidden'}))
            return false
        }
        return true
    }
}   