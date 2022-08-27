import {CollectionModel} from '../collection-model';
import {Collection} from 'mongodb';

export class DiscordRoleCollection implements CollectionModel {
    name: string = 'discord-role';

    async update(collection: Collection): Promise<void> {
        if (!await collection.indexExists('id')) {
            await collection.createIndex({ id: 1 }, {
                unique: true
            })
        }
    }
}
