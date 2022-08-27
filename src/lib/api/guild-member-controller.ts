import {Request, Response} from 'express';

import {RemoteMethod} from '../http/remote-method';
import {BaseController} from '../http/base-controller';
import {inject, service} from '../reflection/inject';
import {GuildMember} from '../models/guild-member';
import {Db} from 'mongodb';
import {GuildMemberDocument} from '../database/models/guild-member-document';

@service()
export class GuildMemberController extends BaseController implements RemoteMethod<GuildMember> {
    private readonly database: Db;

    constructor(@inject('database') database?: Db) {
        super('/api/guild/member');

        this.database = database
    }

    async get(req: Request, res: Response): Promise<GuildMember[]> {
        return (await this.database.collection<GuildMember>('guild-member').find().toArray())
            .map(x => new GuildMemberDocument(x))
    }

    async getById(req: Request, res: Response): Promise<GuildMember> {
        const entry = await this.database.collection('guild-member').findOne<GuildMember>(
            { key: req.params.id }
        )
        return new GuildMemberDocument(entry).toJSON()
    }

    async post(req: Request, res: Response) {
        let data: GuildMember | GuildMember[] = req.body;
        if (!Array.isArray(data))
            data = [data]

        await this.database
            .collection<any>('guild-member')
            .insertMany(
                data.map(x => new GuildMemberDocument(x).toDocument())
            )
    }

    async replaceMany(req: Request, res: Response) {
        let data: GuildMember | GuildMember[] = req.body;
        if (!Array.isArray(data))
            data = [data]

        const bulk = this.database.collection<GuildMember>('guild-member').initializeOrderedBulkOp();
        data.map(x => new GuildMemberDocument(x).toDocument()).forEach(
            x => bulk.find({ key: x.key }).upsert().replaceOne(x)
        )
        await bulk.execute()
    }
}
