import {Request, Response, Router} from 'express';
import {useTypeORM} from '../db/typeorm';
import Review from "../db/entity/review.entity";
import {verifyToken} from "../middleware/auth.middleware";
import {extractUserIdFromToken} from "../utils/Helper";
import {UserEntity} from "../db/entity/user.entity";

const controller = Router();

interface ReviewWithUsername {
    id: number;
    user_id: number;
    order_id: number;
    rating: number;
    comment: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}

controller
    .get('/', async (req: Request, res: Response) => {
        const reviews = await useTypeORM(Review).find();

        const reviewsWithUsername: ReviewWithUsername[] = await Promise.all(reviews.map(async (review) => {
            console.log("review" + review.user_id);
            const user = await useTypeORM(UserEntity).findOne({
            where: {
                id: review.user_id
            }
        });
            console.log(user);
            return {
                id: review.id,
                user_id: review.user_id,
                order_id: review.order_id,
                rating: review.rating,
                comment: review.comment,
                username: user ? user.name : 'Unknown',
                created_at: review.created_at,
                updated_at: review.updated_at
            };
        }));

        res.status(200).send({
            status: 'success',
            data: reviewsWithUsername
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