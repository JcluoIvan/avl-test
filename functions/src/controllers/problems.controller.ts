import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { ControllerCallback } from '../router-handler';
import { env } from '../env';
import { db } from '../database';
import { NotFoundError } from '../errors';
export interface Problem {
    id: string;
    text: string;
    answer: string;
    title: string;
    hashtags: string;
    topicsAlgebra: string;
    topicsGeometry: string;
    topicsTrignometry: string;
    topicsArithmetic: string;
    calculator: string;
    answerType: string;
    chart: string;
    length: string;
}

const loadCSV = (): Promise<Problem[]> => {
    const rows: Problem[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(env.rootPath, 'data/data.csv'))
            .pipe(csvParser())
            .on('data', (data: any) => rows.push(data))
            .on('end', () => resolve(rows))
            .on('error', (err) => reject(err));
    });
};

// q.2 create data
export const initData: ControllerCallback = async (req, res) => {
    const ref = db.collection('problems');
    const rows = await loadCSV();
    while (rows.length > 0) {
        const batch = db.batch();
        const updates = rows.splice(0, 500);
        updates.forEach((r) => {
            batch.set(ref.doc(r.id), r);
        });
        await batch.commit();
    }
    res.end('success');
};

export const findProblem: ControllerCallback = async (req, res) => {
    const id = req.params.id;
    const resDoc = await db.collection('problems').doc(id).get();

    if (!resDoc.exists) {
        throw new NotFoundError('Problem not found');
    }

    res.json(resDoc.data());
};

export const listProblem: ControllerCallback = async (req, res) => {
    const data: {
        calculator: string;
        answerType: string;
        chart: string;
        length: string;
    } = req.query as any;

    const ref = db.collection('problems');
    const page: number = Math.max(Number(req.query.page) || 1, 1);
    const size: number = Math.max(Number(req.query.page) || 5, 5);

    let query = ref.offset(size * (page - 1)).limit(size);

    if (data.calculator) {
        query = query.where('calculator', '==', data.calculator);
    }
    if (data.answerType) {
        query = query.where('answerType', '==', data.answerType);
    }
    if (data.chart) {
        query = query.where('chart', '==', data.chart);
    }
    if (data.length) {
        query = query.where('length', '==', data.length);
    }

    const rows: any[] = [];
    const ds = await query.get();

    ds.forEach((row) => {
        // hide answer
        const { answer, ...values } = row.data();
        rows.push(values);
    });
    res.json({
        rows,
    });
};
