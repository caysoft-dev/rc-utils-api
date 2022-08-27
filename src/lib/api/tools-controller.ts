import {Request, Response} from 'express';
import {Db} from 'mongodb';

import {BaseController} from '../http/base-controller';
import {inject, service} from '../reflection/inject';
import parse from 'csv-parse/lib/sync';
import {RAID_COMPOSITION_MAPPING} from '../game/wowhead-types';

@service()
export class ToolsController extends BaseController {
    private database: Db;

    constructor(@inject('database') database?: Db) {
        super('/api/tools');

        this.database = database;
        this.register('post', 'parseRaidHelperSignUps', '/rh/parse')
    }

    async parseRaidHelperSignUps(req: Request, res: Response): Promise<{ url: string }> {
        const mapping = RAID_COMPOSITION_MAPPING
        const normalizeName = str => {
            if (!str)
                return '';

            const map = {
                '-' : ' ',
                'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
                'e' : 'é|è|ê|ë|É|È|Ê|Ë',
                'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
                'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
                'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
                'c' : 'ç|Ç',
                'n' : 'ñ|Ñ'
            };

            for (let pattern in map) {
                str = str.replace(new RegExp(map[pattern], 'g'), pattern);
            }

            str = str.replace(/<\/?[^>]+(>|$)/g, '').replace(/(\(([^)]+)\))/gi, "")

            return str;
        }

        const data = req.body.data
        const records = parse(data, {
            columns: true,
            skip_empty_lines: true,
        }).sort((a, b) => (normalizeName(a.Name).charCodeAt(0) - normalizeName(b.Name).charCodeAt(0) > 1) ? 1 : -1)

        const roster = {
            heal: [],
            damage: [],
            tank: []
        }
        for (let x of records) {
            const spec = x.Spec;
            const role = mapping.raid_planner_roles[spec];
            switch (role) {
                case 'T':
                    roster.tank.push({ key: mapping.raid_planner[spec], name: normalizeName(x.Name) })
                    break;
                case 'H':
                    roster.heal.push({ key: mapping.raid_planner[spec], name: normalizeName(x.Name) })
                    break;
                case 'D':
                    roster.damage.push({ key: mapping.raid_planner[spec], name: normalizeName(x.Name) })
                    break;
            }
        }

        const tanks = new Array(10).fill({ key: '0', name: '' })
        for (let i in tanks) {
            if (roster.tank[i])
                tanks[i] = roster.tank[i]
        }

        const heals = new Array(10).fill({ key: '0', name: '' })
        for (let i in heals) {
            if (roster.heal[i])
                heals[i] = roster.heal[i]
        }

        const raid = [
            ...tanks,
            ...heals,
            ...roster.damage
        ]

        const urlParam = raid.map(x => x.key).join('') + ';' + raid.map(x => x.name).join(';')
        return {
            url: `https://tbc.wowhead.com/raid-composition#0${urlParam}`
        }
    }
}
