import { Express } from 'express';
import typeORMConnect from '../db/typeorm';

const appSetup = async (app: Express) => {

  try {
    await Promise.all([typeORMConnect()]);
    console.log('PSQL connected successfully!');

    app.listen(3000, () => {
      console.log(`Server started on port 3000`);
    });

  } catch (error: unknown) {
    console.log('Unable to start the app!');
    console.error(error);
  }


};

export default appSetup;