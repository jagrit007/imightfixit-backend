import express from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';

const app = express();
import appSetup from './startup/init';
import routerSetup from './startup/router';
import securitySetup from './startup/security';

void appSetup(app);
securitySetup(app, express);
routerSetup(app);
dotenv.config();