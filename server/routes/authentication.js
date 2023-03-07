import * as express from "express";
import { OAuth2Client } from 'google-auth-library';
import session from 'express-session'
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const authRouter = express.Router();
authRouter.use(express.json());

//middleware to verify the session
export function isAuthenticated(req, res, next) {
    if (!req?.session?.user) {
        return res.sendStatus(204)
    }
    next();
}

authRouter.use(session({
    secret: process.env.SECRET,
    name: 'id',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 120000,
        //should only sent over https, but set to false for testing and dev on localhost
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    }
}));

authRouter.get("/refreshLogin", isAuthenticated, function (req, res) {
    return res.json(req.session.user)
});

authRouter.post("/auth", async (req, res) => {
    const { token } = req.body;

    if (token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        if (!ticket) {
            return res.sendStatus(401);
        }
        const user = {
            "username": ticket.getPayload().name,
            "email": ticket.getPayload().email,
            "pic": ticket.getPayload().picture
        };

        //create a session, using email as the unique identifier
        req.session.regenerate(function (err) {
            if (err) {
                return res.sendStatus(500);
            }
            req.session.user = user;
            res.json({ user: user });
        });
    }
});

//route for authenticated users only
authRouter.get("/protected", isAuthenticated, function (_, res) {
    res.sendStatus(200);
});

authRouter.get("/logout", isAuthenticated, function (req, res) {
    //destroy the session
    req.session.destroy(function (err) {
        //callback invoked after destroy returns
        if (err) {
            //server error, couldn't destroy the session
            return res.sendStatus(500);
        }
        //clear the cookie
        res.clearCookie('id');
        res.sendStatus(200);
    });
});
