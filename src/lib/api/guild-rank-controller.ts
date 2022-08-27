import {Request, Response} from 'express';

import {RemoteMethod} from '../http/remote-method';
import {BaseController} from '../http/base-controller';
import {inject, service} from '../reflection/inject';
import {GuildRank} from '../models/guild-rank';
import {Db} from 'mongodb';

@service()
export class GuildRankController extends BaseController implements RemoteMethod<GuildRank> {
    private readonly database: Db;

    constructor(@inject('database') database?: Db) {
        super('/api/guild/rank');

        this.database = database
    }

    async get(req: Request, res: Response): Promise<GuildRank[]> {
        return await this.database.collection<GuildRank>('guild-rank').find().toArray()
    }

    async getById(req: Request, res: Response): Promise<GuildRank> {
        return await this.database.collection('guild-rank').findOne<GuildRank>(
            { key: req.params.id }
        )
    }

    async post(req: Request, res: Response) {
        let data: GuildRank | GuildRank[] = req.body;
        if (!Array.isArray(data))
            data = [data]

        await this.database
            .collection<any>('guild-rank')
            .insertMany(data)
    }

    async replaceMany(req: Request, res: Response) {
        let data: GuildRank | GuildRank[] = req.body;
        if (!Array.isArray(data))
            data = [data]

        const bulk = this.database.collection<GuildRank>('guild-rank').initializeOrderedBulkOp();
        data.forEach(
            x => bulk.find({ index: x.index }).upsert().replaceOne(x)
        )
        await bulk.execute()
    }
}
