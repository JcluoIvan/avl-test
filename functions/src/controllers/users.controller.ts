import { ControllerCallback } from '../router-handler';
import { db } from '../database';
import { NotFoundError } from '../errors';

export const findUser: ControllerCallback = async (req, res) => {
    const id = req.params.id || '';

    const user = await db.collection('users').doc(id).get();

    if (!user.exists) {
        throw new NotFoundError('User not found');
    }
    res.json(user.data());
};
