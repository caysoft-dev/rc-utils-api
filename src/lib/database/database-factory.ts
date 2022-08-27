import {Db, MongoClient} from 'mongodb';
import {CollectionModel} from './collection-model';
import {GuildMemberCollection} from './collections/guild-member-collection';
import {PlayerCollection} from './collections/player-collection';
import {GuildRankCollection} from './collections/guild-rank-collection';
import {DiscordRoleCollection} from './collections/discord-role-collection';

export class DatabaseFactory {
    private readonly connectionPromise: Promise<Db>
    private database: Db;
    private collections: string[]

    constructor() {
        this.connectionPromise = new MongoClient(process.env.MONGODB_URI)
            .connect().then(x => this.onConnect(x))
    }

    async connect(): Promise<Db> {
        return await this.connectionPromise
    }

    private async updateCollection(model: CollectionModel): Promise<void> {
        let collections = await this.database.collections()
        let collection = collections.find(x => x.collectionName === model.name)

        if (!collection) {
            collection = await this.database.createCollection(model.name)
        }

        await model.update(collection)
    }

    private async onConnect(client: MongoClient): Promise<Db> {
        this.database = client.db()
        await this.updateCollection(new DiscordRoleCollection())
        await this.updateCollection(new GuildMemberCollection())
        await this.updateCollection(new GuildRankCollection())
        await this.updateCollection(new PlayerCollection())
        return this.database
    }
}
