import {GuildMember} from '../../models/guild-member';
import {ObjectId} from 'mongodb';
import {DocumentModel} from '../document-model';

export class GuildMemberDocument implements DocumentModel<GuildMember> {
    _id?: ObjectId | string;
    key?: string;
    name: string;
    class: string;
    level: number;
    note: string;
    rank: string;
    rankIndex: number;

    constructor(data?: GuildMember) {
        if (data) {
            Object.assign(this, data)
            this.name = this.name.split('-')[0]
            this.name = unescape(this.name)
            this.note = unescape(this.note)
            this.key = this.name.toLatin({ noMatchReplacement: 'z' })
        }
    }

    toDocument(): DocumentModel<GuildMember> {
        const doc = this.toJSON() as DocumentModel<GuildMember>

        if (this._id) {
            doc._id = this._id;
            if (typeof doc._id === 'string')
                doc._id = ObjectId.createFromHexString(doc._id)
        }

        doc.name = escape(doc.name)
        doc.note = escape(doc.note)

        return doc
    }

    toJSON(): GuildMember {
        return {
            key: this.key,
            name: this.name,
            class: this.class,
            level: this.level,
            rank: this.rank,
            rankIndex: this.rankIndex,
            note: this.note,
        }
    }
}
