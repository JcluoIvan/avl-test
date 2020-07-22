import { ControllerCallback } from '../router-handler';
import { google } from 'googleapis';
import { env } from '../env';
import { ForbiddenError } from '../errors';
import { db } from '../database';

const gOauth2 = () => {
    return new google.auth.OAuth2(
        env.oauth2.google.clientID,
        env.oauth2.google.clientSecret,
        env.oauth2.google.redirectURL,
    );
};

export const loginGoogle: ControllerCallback = async (req, res) => {
    const oauth2 = gOauth2();
    const url = oauth2.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
    res.redirect(url);
};

export const googleCallback: ControllerCallback = async (req, res) => {
    const code = req.query.code as string;

    const oauth2 = gOauth2();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const info = await google.oauth2('v2').userinfo.get({ auth: oauth2 });
    const { id = '', email = 'no-email', name = 'no-name' } = info.data;
    if (!id) {
        throw new ForbiddenError('user id not found');
    }
    const doc = db.collection('users').doc(id);
    await doc.set({ id, email, name });
    res.send(`
        login success. <a href="/run/users/${id}">Your Profile</a>
        <script>opener && opener.postMessage({user: '${id}'});</script>
    `);
};
