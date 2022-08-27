import {CollectionModel} from '../collection-model';
import {Collection} from 'mongodb';

export class GuildRankCollection implements CollectionModel {
    name: string = 'guild-rank';

    async update(collection: Collection): Promise<void> {
        if (!await collection.indexExists('index')) {
            await collection.createIndex({ index: 1 }, {
                unique: true
            })
        }
    }
}
