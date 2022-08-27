import {Collection} from 'mongodb';

export interface CollectionModel {
    name: string;
    update(collection: Collection): Promise<void>;
}
