import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const ROOT_PATH = path.resolve(__dirname, '../');

export const env = {
    rootPath: ROOT_PATH,
    isDev: process.env.MODE !== 'product',
    problems: {
        min: Number(process.env.PROBLEM_MIN) || 0,
        max: Number(process.env.PROBLEM_MAX) || 0,
    },
    gmail: {
        username: process.env.GMAIL_USER,
        password: process.env.GMAIL_PASSWORD,
    },
    oauth2: {
        google: {
            clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
            clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
            redirectURL: process.env.OAUTH2_GOOGLE_CLIENT_REDIRECT_URL,
        },
    },
};
