import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { env } from '../env';
import { ControllerCallback } from '../router-handler';
import { BadRequestError } from '../errors';
import { HttpStatus } from '../typings';
import * as validator from 'validator';

const mailerTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.gmail.username,
        pass: env.gmail.password,
    },
});
const promiseSendMail = (data: Mail.Options): Promise<void> => {
    return new Promise((resolve, reject) => {
        mailerTransport.sendMail(data, (err) => (err ? reject(err) : resolve()));
    });
};
export const sendEmail: ControllerCallback = async (req, res) => {
    const data: {
        subject: string;
        to: string;
        text: string;
    } = req.body;
    if (!data.to || !validator.isEmail(data.to)) {
        throw new BadRequestError(`收件人必需為 email 格式`);
    }
    if (!data.subject) {
        throw new BadRequestError(`"Subject" 為必填`);
    }
    if (!data.text) {
        throw new BadRequestError(`"Text" 為必填`);
    }

    await promiseSendMail({
        subject: data.subject,
        to: data.to,
        text: data.text,
    });

    res.status(HttpStatus.StatusNoContent).end();
};
