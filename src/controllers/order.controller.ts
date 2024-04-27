import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import {Service} from "../db/entity/service.entity";
import {verifyToken} from "../middleware/auth.middleware";
import {Role, UserEntity} from "../db/entity/user.entity";
import {Order, Status} from "../db/entity/order.entity";
import {extractUserIdFromToken, getOrderStatusFromString} from "../utils/Helper";
import {ObjectLiteral} from "typeorm";


const controller = Router();

controller
    .get('/', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if (userId === -1 ) {
            return;
        }
        const orderStatus = getOrderStatusFromString(req.body.order_status);

        const user = await useTypeORM(UserEntity).findOneBy({ id: userId });
        if (!user) {
            return res.status(400).send({
                status: 'failure',
                result: 'Invalid user'
            });
        }

        let orders: ObjectLiteral[];
        if (user.role === Role.Provider) {
            console.log("provider user" + user.id);
            // Fetch all orders, regardless of user role
            orders = await useTypeORM(Order).find({ where: {status: orderStatus } });
        } else {
            console.log("normal user" + user.id);
            // Fetch only the orders placed by the user
            orders = await useTypeORM(Order).find({where: {user_id: user.id, status: orderStatus} });
        }

        res.status(200).send({
            status: 'success',
            data: orders
        });
    })
    .get('/total-revenue', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if (userId === -1) {
            return;
        }

        const user = await useTypeORM(UserEntity).findOneBy({ id: userId });
        if (!user || user.role !== Role.Provider) {
            return res.status(403).send({
                status: 'failure',
                result: 'Forbidden'
            });
        }

        const totalRevenue = await useTypeORM(Order)
            .createQueryBuilder('order')
            .where('order.status != :status', { status: Status.Cancelled })
            .select('SUM(order.total_price) AS total_revenue')
            .getRawOne();

        res.status(200).send({
            status: 'success',
            total_revenue: totalRevenue.total_revenue
        });
    })
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
    })
    .patch('/accept/:order_id', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if (userId == -1) {
            return;
        }

        const orderId = parseInt(req.params.order_id);
        const totalPrice = req.headers.total_price;

        const user = await useTypeORM(UserEntity).findOneBy({ id: userId });
        const order = await useTypeORM(Order).findOneBy({ id: orderId });
        if (!user || !order || !totalPrice) {
            return res.status(400).send({
                status: 'failure',
                result: 'Invalid request data'
            });
        } else if(user.role !== Role.Provider) {
            return res.status(401).send({
                status: 'failure',
                result: 'Unauthorised'
            })
        }

        order.status = Status.InProgress;
        order.total_price = totalPrice;
        const updatedOrder = await useTypeORM(Order).save(order);

        res.status(200).send({
            status: 'success',
            order_id: updatedOrder.id,
            order_status: updatedOrder.status,
            total_price: updatedOrder.total_price
        });
    })
    // COMPLETE OR CANCEL
    .patch('/finish/:order_id', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if (userId == -1) {
            return;
        }

        const orderStatusString = req.body.order_status;
        const orderStatus = getOrderStatusFromString(orderStatusString);
        const orderId = parseInt(req.params.order_id);

        const user = await useTypeORM(UserEntity).findOneBy({ id: userId });
        const order = await useTypeORM(Order).findOneBy({ id: orderId });

        if (!user || !order || !orderStatus) {
            return res.status(400).send({
                status: 'failure',
                result: 'Invalid request data'
            });
        } else if(user.role !== Role.Provider) {
            return res.status(401).send({
                status: 'failure',
                result: 'Unauthorised'
            })
        }

        order.status = orderStatus;
        const updatedOrder = await useTypeORM(Order).save(order);

        res.status(200).send({
            status: 'success',
            order_id: updatedOrder.id,
            order_status: updatedOrder.status,
            total_price: updatedOrder.total_price
        });
    });

export default controller;