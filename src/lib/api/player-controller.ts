import {Request, Response} from 'express';

import {RemoteMethod} from '../http/remote-method';
import {Player} from '../models/player';
import {BaseController} from '../http/base-controller';
import {service} from '../reflection/inject';

@service()
export class PlayerController extends BaseController implements RemoteMethod<Player> {
    constructor() {
        super('/api/player');

        this.register('get', 'me', '/me')
    }

    async me(req: Request, res: Response): Promise<Player> {
        return req.user as Player
    }

    async get(req: Request, res: Response): Promise<Player[]> {
        return [
        ]
    }
}
