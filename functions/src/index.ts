import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { routers } from './routes';
import { NotFoundError } from './errors';
import { errorHandle } from './router-handler';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routers);

// not found
app.use((req, res, next) => next(new NotFoundError('Page Not Found')));

// error handle
app.use(errorHandle);

export const run = functions.https.onRequest(app);
