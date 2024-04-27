import { Router, Request, Response } from 'express';
import { useTypeORM } from '../db/typeorm';
import {Service} from "../db/entity/service.entity";
import {Role, UserEntity} from "../db/entity/user.entity";

const controller = Router();

controller
    .get('/getAll', async (req: Request, res: Response) => {
        const services = await useTypeORM(Service).find();
        res.status(200).send({
            status: 'success',
            data: services
        });
    })
    .post('/add', async (req: Request, res: Response) => {
        const user = await useTypeORM(UserEntity).findOneBy({id: req.body.user_id});
        if(user != null && user.role == Role.Provider) {

            res.status(200).send({
                status: 'failure',
                result: 'Incorrect Credentials!'
            });
        } else {
            res.status(401).send({
                status: 'failure',
                result: 'Unauthorised'
            });
        }
    });

export default controller;