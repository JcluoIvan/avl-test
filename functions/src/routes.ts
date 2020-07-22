import * as express from 'express';
import * as path from 'path';
import { ctrlHandle } from './router-handler';
import { viewIndex } from './controllers';
import { env } from './env';
import {
    // initData,
    findProblem,
    listProblem,
} from './controllers/problems.controller';
import { sendEmail } from './controllers/mails.controller';
import { loginGoogle, googleCallback } from './controllers/login.controller';
import { findUser } from './controllers/users.controller';
import { startTest, nextTest, answerTest, resultTest } from './controllers/tests.controller';

const r = express.Router();

// static
r.use('/web', express.static(path.resolve(env.rootPath, 'public')));

// index
r.get('/', ctrlHandle(viewIndex));

// q.1
r.post('/mails/send', ctrlHandle(sendEmail));

// q.2
// r.get('/problems/init', ctrlHandle(initData));
r.get('/problems/:id', ctrlHandle(findProblem));

// q.3
r.get('/problems', ctrlHandle(listProblem));

// q.4
r.get('/login/google', ctrlHandle(loginGoogle));
r.get('/login/google/callback', ctrlHandle(googleCallback));
r.get('/users/:id', ctrlHandle(findUser));

// q.5
r.post('/tests/:uid/start', ctrlHandle(startTest));
r.get('/tests/:uid/next', ctrlHandle(nextTest));
r.post('/tests/:uid/answer', ctrlHandle(answerTest));
r.post('/tests/:uid/result', ctrlHandle(resultTest));

export const routers = r;
