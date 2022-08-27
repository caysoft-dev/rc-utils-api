import {ObjectId} from 'mongodb';
import {DocumentModel} from '../document-model';
import {DiscordRole} from '../../models/discord-role';

export class DiscordRoleDocument implements DocumentModel<DiscordRole> {
    _id?: ObjectId;
    id: string;
    name: string;
    permission: string;
    position: number;
    color: number;
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    maxGuildRankIndex?: number;
    settings?: {
        characterAssignment: {
            canAssignEverybody: boolean;
            canAssignSelf: boolean;
            assignableGuildRanks: number[]
        }
    }

    constructor(data?: any) {
        if (data) {
            Object.assign(this, data)

            if (!this.settings) {
                this.settings = {
                    characterAssignment: {
                        canAssignSelf: false,
                        canAssignEverybody: false,
                        assignableGuildRanks: []
                    }
                }
            }
        }
    }

    toDocument(): DocumentModel<DiscordRole> {
        const doc = this.toJSON() as DocumentModel<DiscordRole>

        if (this._id) {
            doc._id = this._id;
            if (typeof doc._id === 'string')
                doc._id = ObjectId.createFromHexString(doc._id)
        }

        return doc
    }

    toJSON(): DiscordRole {
        return {
            id: this.id,
            name: this.name,
            permission: this.permission,
            position: this.position,
            color: this.color,
            hoist: this.hoist,
            managed: this.managed,
            mentionable: this.mentionable,
            maxGuildRankIndex: this.maxGuildRankIndex,
            settings: this.settings
        }
    }
}
