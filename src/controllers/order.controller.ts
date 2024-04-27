import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import {Service} from "../db/entity/service.entity";
import {verifyToken} from "../middleware/auth.middleware";
import {UserEntity} from "../db/entity/user.entity";
import {Order, Status} from "../db/entity/order.entity";
import {extractUserIdFromToken} from "../utils/Helper";


const controller = Router();

controller
    .post('/place/:service_id', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if(userId == -1) {
            return;
        }
        const serviceId = req.params.service_id;

        const user = await useTypeORM(UserEntity).findOneBy({ id: userId });
        const service = await useTypeORM(Service).findOneBy({ id: serviceId });

        if (!user || !service) {
            return res.status(400).send({
                status: 'failure',
                result: 'Invalid request data'
            });
        }

        const order = new Order();
        order.user_id = user.id;
        order.service_id = service.id;
        order.status = Status.Pending;
        order.total_price = null; // Price will be set later

        const newOrder = await useTypeORM(Order).save(order);

        res.status(201).send({
            status: 'success',
            order_id: newOrder.id,
            order_status: newOrder.status,
        });
    });

export default controller;