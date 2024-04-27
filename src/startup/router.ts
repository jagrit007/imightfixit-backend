import { Express, Request, Response } from 'express';
import userRouter from '../controllers/user.controller';
import serviceRouter from '../controllers/service.controller';

const routerSetup = (app: Express) =>
  app.get('/', async (req: Request, res: Response) => {
      res.send('Hello Jay!');
  })
      .use('/user', userRouter)
      .use('/service', serviceRouter);

export default routerSetup;