import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import {Service} from "../db/entity/service.entity";
import {Role, UserEntity} from "../db/entity/user.entity";
import {verifyToken} from "../middleware/auth.middleware";
import jwt from 'jsonwebtoken';


const controller = Router();

controller
    .get('/getAll', async (req: Request, res: Response) => {
        const services = await useTypeORM(Service).find();
        res.status(200).send({
            status: 'success',
            data: services
        });
    })
    .post('/add', verifyToken, async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[0];
        const userId = jwt.verify(token!, 'your_secret_key').sub;

        const user = await useTypeORM(UserEntity).findOneBy({id: userId});
        if(user != null && user.role == Role.Provider) {
            const service = new Service();
            service.name = req.body.name;
            service.description = req.body.description;
            service.price = req.body.price;
            service.duration = req.body.duration;

            const newService = await useTypeORM(Service).save(service);
            res.status(200).send({
                status: 'success',
                data: newService
            });
        } else {
            res.status(401).send({
                status: 'failure',
                result: 'Unauthorised'
            });
        }
    });

export default controller;