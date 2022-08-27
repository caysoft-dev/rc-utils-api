import {CollectionModel} from '../collection-model';
import {Collection} from 'mongodb';

export class GuildMemberCollection implements CollectionModel {
    name: string = 'guild-member';

    async update(collection: Collection): Promise<void> {}
}
