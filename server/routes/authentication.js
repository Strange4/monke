import * as express from "express";
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import createHttpError from "http-errors";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const authRouter = express.Router();
authRouter.use(express.json());

/**
 * middleware to verify the session
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function isAuthenticated(req, res, next) {
    if (!req?.session?.email) {
        return res.sendStatus(204)
    }
    next();
}

/**
 * Get endpoint that returns the session user
 * Makes sure to log back in the user when page is refreshed
 */
authRouter.get("/refreshLogin", isAuthenticated, function (req, res) {
    return res.sendStatus(200);
});

/**
 * Post endpoint to login / authenticate the user
 * Creates a session using user email as unique id
 */
authRouter.post("/login", async (req, res) => {
    const { token } = req.body;
    if(!token){
        next(new createHttpError.BadRequest("No google token in body"));
        return;
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    if (!ticket) {
        return res.sendStatus(401);
    }
    const payload = ticket.getPayload();
    const user = {
        username: payload.name,
        pic: payload.picture
    };

    req.session.regenerate(function (err) {
        if (err) {
            return res.sendStatus(500);
        }
        req.session.email = payload.email;
        res.json({ user: user });
    });
});

/**
 * Get endpoint to be used by client side to check if user is authenticated
 */
authRouter.get("/protected", isAuthenticated, function (_, res) {
    res.sendStatus(200);
});

/**
 * Get endpoint to logout the authenticated user
 */
authRouter.get("/logout", isAuthenticated, function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.sendStatus(500);
        }
        res.clearCookie('id');
        res.sendStatus(200);
    });
});
