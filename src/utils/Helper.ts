import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import {JWT_SECRET} from "../middleware/auth.middleware";
import {Status} from "../db/entity/order.entity";

export const extractUserIdFromToken = (req: Request, res: Response): number => {
    const token = req.headers.authorization?.split(' ')[0];
    if (!token) {
        res.status(403).send({
            status: 'failure',
            result: 'No token provided.'
        });
        return -1;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!);
        // @ts-expect-error i just want it to go
        return typeof decoded.sub === 'string' ? parseInt(decoded.sub) : decoded.sub;
    } catch (err) {
        res.status(401).send({
            status: 'failure',
            result: 'Failed to authenticate token.'
        });
        return -1;
    }
};

export function getOrderStatusFromString(statusString: string): Status | undefined {
    const statusMap: { [key: string]: Status } = {
        'pending': Status.Pending,
        'in_progress': Status.InProgress,
        'completed': Status.Completed,
        'cancelled': Status.Cancelled,
        'paid': Status.Paid,
    };

    return statusMap[statusString];
}