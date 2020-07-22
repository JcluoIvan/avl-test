import * as path from 'path';
import { ControllerCallback } from '../router-handler';
import { env } from '../env';

export const viewIndex: ControllerCallback = async (req, res) => {
    res.sendFile(path.resolve(env.rootPath, 'public/index.html'));
};
