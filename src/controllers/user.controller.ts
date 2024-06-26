import bcrypt from 'bcryptjs';
import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import {UserEntity} from '../db/entity/user.entity';
import {JWT_SECRET} from "../middleware/auth.middleware";

const jwt = require("jsonwebtoken");

const controller = Router();

controller
    .post('/register', async (req: Request, res: Response) => {
        const user = new UserEntity();
        user.name = req.body.name;
        user.email = req.body.email;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);


        const newuser = await useTypeORM(UserEntity).save(user);
        res.status(201).send({
            status: 'success',
            data: newuser
        });
    })
    .post('/login', async (req: Request, res: Response) => {
        const validUser = await useTypeORM(UserEntity).findOneBy({ email: req.body.email });
        console.log(validUser);
        if (!validUser || !(await bcrypt.compare(req.body.password, validUser.password))) {
                res.status(401).send({
                        status: 'failure',
                        result: 'Incorrect Credentials!'
                });
        } else {
            const token = jwt.sign({ userId: validUser.id }, JWT_SECRET, { expiresIn: '1h' });
                res.status(201).send({
                        status: 'success',
                        user_id: validUser.id,
                        name: validUser.name,
                        email: validUser.email,
                        role: validUser.role,
                        token: token,
                        result: 'User logged in successfully!'
                });
        }
    });

export default controller;