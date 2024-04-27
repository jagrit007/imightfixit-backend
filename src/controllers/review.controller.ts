import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import Review from "../db/entity/review.entity";
import {verifyToken} from "../middleware/auth.middleware";
import {extractUserIdFromToken} from "../utils/Helper";

const controller = Router();

controller
    .get('/', async (req: Request, res: Response) => {
        const reviews = await useTypeORM(Review).find();
        res.status(200).send({
            status: 'success',
            data: reviews
        });
    })
    .post('/', verifyToken, async (req: Request, res: Response) => {
        const userId = extractUserIdFromToken(req, res);
        if (userId === -1) {
            return;
        }

        const { rating, comment } = req.body;

        const newReview = new Review();
        newReview.user_id = userId;
        newReview.rating = rating;
        newReview.comment = comment;

        try {
            const savedReview = await useTypeORM(Review).save(newReview);

            res.status(201).send({
                status: 'success',
                data: savedReview
            });
        } catch (error) {
            res.status(400).send({
                status: 'failure',
                result: 'Failed to add review'
            });
        }
    })
;

export default controller;