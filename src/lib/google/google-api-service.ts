import {drive} from '@googleapis/drive';
import {sheets, auth} from '@googleapis/sheets';

import {GoogleApis, sheets_v4} from 'googleapis';
import {GoogleSpreadsheet} from './apis/google-spreadsheet';

export class GoogleApiService {
    private api: sheets_v4.Sheets
    private authClient;
    private test: GoogleApis;

    constructor() {}

    async connect() {
        this.authClient = await new auth.GoogleAuth({
            keyFilename: '/home/patrick/Development/rc-utils-api/google-keyfile.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        }).getClient();

        this.api = await new sheets_v4.Sheets({
            auth: this.authClient
        })

        this.test = new GoogleApis({
            auth: this.authClient
        })

        console.log(this.api)
    }

    async getSpreadsheet(id: string): Promise<GoogleSpreadsheet> {
        const spreadsheet = new GoogleSpreadsheet(this.api, id)
        await spreadsheet.resolve()
        return spreadsheet
    }

    async grantPermission(fileId: string, email: string) {
        await drive({version: 'v3', auth: this.authClient}).permissions.create({
            fileId: fileId,
            requestBody: {
                type: 'user',
                role: 'writer',
                emailAddress: email
            }
        })
    }

    async createSpreadsheet(title: string) {
        try {
            const spreadsheet = await this.api.spreadsheets.create({
                fields: 'spreadsheetId',
                requestBody: {
                    sheets: [
                        {
                            properties: {
                                title: 'Sheet1'
                            }
                        }
                    ],
                    properties: {
                        title: title
                    }
                }
            })
            console.log(spreadsheet)
        } catch (e) {
            console.error(e)
        }
    }

    async updateSpreadsheet(id: string) {
        try {
            const spreadsheet = await this.api.spreadsheets.batchUpdate({
                spreadsheetId: id,
                requestBody: {
                    requests: [
                        {
                            repeatCell: {
                                fields: '*',
                                range: {
                                    sheetId: 1039350520,
                                    startRowIndex: 1,
                                    endRowIndex: 5,
                                    startColumnIndex: 0,
                                    endColumnIndex: 2
                                },
                                cell: {
                                    userEnteredFormat: {
                                        backgroundColor: {
                                            red: 1,
                                            green: 0,
                                            blue: 0,
                                            alpha: 0
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            })
            console.log(spreadsheet)
        } catch (e) {
            console.error(e)
        }
    }

    async updateSpreadsheet2(id: string) {
        try {
            const spreadsheet = await this.api.spreadsheets.values.update(<any>{
                spreadsheetId: id,
                range: 'A3',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [
                        ['a1', 'b1'],
                        ['a2', 'b2'],
                        ['a2', 'b2'],
                        ['a2', 'b23'],
                        ['a2', 'b23'],
                        ['a2', 'b23']
                    ]
                }
            })
            console.log(spreadsheet)
        } catch (e) {
            console.error(e)
        }
    }
}
