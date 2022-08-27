import {CollectionModel} from '../collection-model';
import {Collection} from 'mongodb';

export class PlayerCollection implements CollectionModel {
    name: string = 'player';

    async update(collection: Collection): Promise<void> { }
}
