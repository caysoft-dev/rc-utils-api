import {ObjectId} from 'mongodb';

export type DocumentModel<T> = T & {_id?: ObjectId | string}
