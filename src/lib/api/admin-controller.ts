import {Request, Response} from 'express';
import {Db} from 'mongodb';

import {BaseController} from '../http/base-controller';
import {inject, service} from '../reflection/inject';
import {DiscordService} from '../discord/discord-service';
import {DiscordRole} from '../models/discord-role';
import {GuildMemberDocument} from '../database/models/guild-member-document';
import {DiscordRoleDocument} from '../database/models/discord-role-document';
import {GuildMember} from '../models/guild-member';

@service()
export class AdminController extends BaseController {
    private discord: DiscordService;
    private database: Db;

    constructor(@inject('discord') discord?: DiscordService, @inject('database') database?: Db) {
        super('/api/admin');

        this.discord = discord;
        this.database = database;
        this.register('get', 'getDiscordRoles', '/discord/roles')
        this.register('post', 'updateDiscordRoles', '/discord/fetch/roles')
        this.register('put', 'replaceManyDiscordRoles', '/discord/roles')
    }

    async getDiscordRoles(req: Request, res: Response): Promise<DiscordRole[]> {
        return (await this.database
            .collection<DiscordRoleDocument>('discord-role')
            .find()
            .toArray())
            .map(x => new DiscordRoleDocument(x))
    }

    async updateDiscordRoles(req: Request, res: Response): Promise<void> {
        const roles = await this.discord.getGuildRoles();
        const bulk = this.database.collection<DiscordRoleDocument>('discord-role').initializeOrderedBulkOp();
        roles.map(x => new DiscordRoleDocument(x).toDocument()).forEach(
            x => bulk.find({ id: x.id }).upsert().replaceOne(x)
        )
        await bulk.execute()
    }

    async replaceManyDiscordRoles(req: Request, res: Response): Promise<void> {
        const roles = req.body;
        const bulk = this.database.collection<DiscordRoleDocument>('discord-role').initializeOrderedBulkOp();
        roles.map(x => new DiscordRoleDocument(x).toDocument()).forEach(
            x => bulk.find({ id: x.id }).upsert().replaceOne(x)
        )
        await bulk.execute()
    }
}
