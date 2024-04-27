import {NextFunction, Request, Response} from 'express';

const jwt = require("jsonwebtoken");

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[0];
    if (!token) {
        return res.status(403).send({
            status: 'failure',
            result: 'No token provided.'
        });
    }

    jwt.verify(token, 'your_secret_key', (err: any, decoded: { userId: any; }) => {
        if (err) {
            return res.status(401).send({
                status: 'failure',
                result: 'Failed to authenticate token.'
            });
        }
        req.body.userId = decoded.userId;
        next();
    });
};