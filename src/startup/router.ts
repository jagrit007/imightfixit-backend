import {Express, Request, Response} from 'express';
import userRouter from '../controllers/user.controller';
import serviceRouter from '../controllers/service.controller';
import orderRouter from '../controllers/order.controller';
import reviewRouter from '../controllers/review.controller';

const routerSetup = (app: Express) =>
    app.get('/', async (req: Request, res: Response) => {
        res.send('Hello Jay!');
    })
        .use('/user', userRouter)
        .use('/service', serviceRouter)
        .use('/order', orderRouter)
        .use('/review', reviewRouter);


export default routerSetup;