import {inject, service} from '../reflection/inject';
import {Db} from 'mongodb';
import {Player} from '../models/player';

@service()
export class UserService {
    private database: Db;

    constructor(@inject('database') db?: Db) {
        this.database = db
    }

    async updatePlayerNick(id: string, nick: string) {
        await this.database.collection('player').updateOne({ _id: id }, { $set: { nick: nick } })
    }

    async getPlayerByNickname(nickname: string): Promise<Player> {
        return await this.database.collection('player').findOne<Player>({ $or: [{username: nickname}, {nick: nickname}] })
    }

    async getPlayer(id: string): Promise<Player> {
        return await this.database.collection('player').findOne<Player>({ _id: id })
    }

    async updatePlayer(id: string, player: Partial<Player>) {
        return await this.database.collection('player').updateOne({ _id: id }, { $set: player, $setOnInsert: { _id: id, characters: [] } }, { upsert: true })
    }
}
