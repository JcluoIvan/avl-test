import { ControllerCallback } from '../router-handler';
import { db } from '../database';
import { NotFoundError } from '../errors';
import * as _ from 'lodash';
import { Problem } from './problems.controller';
import { HttpStatus } from '../typings';
import { env } from '../env';

interface UserTest {
    done: boolean;
    total: number;
    correct: number;
}

const getUserTest = async (uid: string): Promise<UserTest> => {
    const docTest = await db.collection('tests').doc(uid).get();
    const utest: UserTest = docTest.data() as any;

    if (!docTest.exists) {
        throw new NotFoundError('Test not found');
    }

    return utest;
};

export const startTest: ControllerCallback = async (req, res) => {
    const uid = req.params.uid || '';
    const user = await db.collection('users').doc(uid).get();
    if (!user.exists) {
        throw new NotFoundError('User not found');
    }

    await db.collection('tests').doc(uid).set({
        total: 0,
        correct: 0,
    });

    res.status(HttpStatus.StatusNoContent).end();
};

export const nextTest: ControllerCallback = async (req, res) => {
    const docProblems = db.collection('problems');

    const pid = _.random(env.problems.min, env.problems.max);

    const ds = await docProblems.doc(`problem${pid}`).get();
    if (!ds.exists) {
        throw new NotFoundError('Problem not found');
    }
    const problem: Problem = ds.data() as any;

    res.json({
        id: problem.id,
        title: problem.title,
        text: problem.text,
    });
};

export const answerTest: ControllerCallback = async (req, res) => {
    const uid = req.params.uid || '';
    const utest = await getUserTest(uid);

    const pid = req.body.id;
    const value = req.body.value;

    const rdoc = await db.collection('problems').doc(pid).get();
    const problem: Problem = rdoc.data() as any;
    utest.total++;
    if (problem.answer === value) {
        utest.correct++;
    }

    await db.collection('tests').doc(uid).set(utest);
    res.status(HttpStatus.StatusNoContent).end();
};

export const resultTest: ControllerCallback = async (req, res) => {
    const uid = req.params.uid || '';
    const utest = await getUserTest(uid);
    res.json(utest);
};
