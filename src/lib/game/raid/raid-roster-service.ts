import {Db} from 'mongodb';
import {inject, service} from '../../reflection/inject';
import {WowheadClassMap} from '../wowhead-types';
import {GoogleApiService} from '../../google/google-api-service';
import {PlayerClassColors} from '../types';
import {RaidGroup} from './raid-group';
import {RaidMember} from './raid-member';
import {Raid} from './raid';

@service()
export class RaidRosterService {
    private readonly db: Db;
    private readonly googleApi: GoogleApiService

    constructor(@inject('db') db?: Db, @inject('google-api') googleApi?: GoogleApiService) {
        this.db = db
        this.googleApi = googleApi
    }

    async parseWowheadRaid(url: string) {
        const id = '1Eo75e_QZuaoysKqv10QIm-KsDmfd1xtSwe25N7e7XMQ'
        const params = url.replace('https://tbc.wowhead.com/raid-composition#0', '').split(';')
        const slots = params[0]
        const names = params.slice(1)
        const players = []

        for (let i = 0; i < slots.length; ++i) {
            players.push(new RaidMember(names[i], WowheadClassMap[slots[i]]))
        }

        const raid = new Raid(players)
        const spreadsheet = await this.googleApi.getSpreadsheet(id);
        const api = spreadsheet.getSpreadsheetApi();

        const sheetGroupIndex = (sheetId, index) => ([
            {// Group 1
                sheetId: sheetId,
                startRowIndex: 5,
                endRowIndex: 10,
                startColumnIndex: 1,
                endColumnIndex: 2
            },
            {// Group 2
                sheetId: sheetId,
                startRowIndex: 5,
                endRowIndex: 10,
                startColumnIndex: 4,
                endColumnIndex: 5
            },
            {// Group 3
                sheetId: sheetId,
                startRowIndex: 5,
                endRowIndex: 10,
                startColumnIndex: 7,
                endColumnIndex: 8
            },
            {// Group 4
                sheetId: sheetId,
                startRowIndex: 12,
                endRowIndex: 17,
                startColumnIndex: 1,
                endColumnIndex: 2
            },
            {// Group 4
                sheetId: sheetId,
                startRowIndex: 12,
                endRowIndex: 17,
                startColumnIndex: 4,
                endColumnIndex: 5
            }
        ][index])

        const result = await api.batchUpdate({
            spreadsheetId: id,
            requestBody: {
                requests: raid.groups.map((group, index) => ({
                    updateCells: {
                        fields: '*',
                        range: sheetGroupIndex(0, index),
                        rows: group.players.map(x => ({
                            values: [
                                {
                                    userEnteredValue: {
                                        stringValue: x.name
                                    },
                                    userEnteredFormat: {
                                        backgroundColor: PlayerClassColors[x.class],
                                        horizontalAlignment: 'CENTER',
                                        borders: {
                                            bottom: {
                                                color: { red: 0, blue: 0, green: 0 },
                                                style: 'SOLID'
                                            },
                                            top: {
                                                color: { red: 0, blue: 0, green: 0 },
                                                style: 'SOLID'
                                            },
                                            left: {
                                                color: { red: 0, blue: 0, green: 0 },
                                                style: 'SOLID'
                                            },
                                            right: {
                                                color: { red: 0, blue: 0, green: 0 },
                                                style: 'SOLID'
                                            }
                                        }
                                    }
                                }
                            ]
                        }))
                    }
                }))
            }
        })

        console.log(params)
    }
}
