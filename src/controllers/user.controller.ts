import { Router, Request, Response } from 'express';
import { useTypeORM } from '../db/typeorm';
import { UserEntity } from '../db/entity/user.entity';

const controller = Router();

controller
    .post('/register', async (req: Request, res: Response) => {
        const user = new UserEntity();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;


        const newuser = await useTypeORM(UserEntity).save(user);
        res.status(201).send(newuser);
    })
    .get('/login', async (req: Request, res: Response) => {
            const validUser = await useTypeORM(UserEntity).findOneBy({ email: req.body.email, password: req.body.password });
            if(!validUser) {
                    res.status(401).send({
                            status: 'failure',
                            result: 'Incorrect Credentials!'
                    });
            } else {
                    res.status(201).send({
                            status: 'success',
                            user_id: validUser.id,
                            result: 'User logged in successfully!'
                    });
            }
    });

export default controller;