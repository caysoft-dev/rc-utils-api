import {sheets_v4} from 'googleapis';
import Schema$Spreadsheet = sheets_v4.Schema$Spreadsheet;
import Schema$Sheet = sheets_v4.Schema$Sheet;
import Resource$Spreadsheets = sheets_v4.Resource$Spreadsheets;

export type ColorFormatRGB = {
    alpha?: number;
    blue?: number;
    green?: number;
    red?: number;
}

export type SheetIdentifier = number | string;

export type SpreadsheetTableCell = {
    value: any;
    backgroundColor?: ColorFormatRGB,
    textColor?: ColorFormatRGB
}

export type SpreadsheetTableOptions = {
    sheet: SheetIdentifier;
    startRow: number;
    startCol: number;
    cells?: SpreadsheetTableCell[][]
}

export class GoogleSpreadsheet {
    protected spreadsheet: Schema$Spreadsheet

    constructor(private api: sheets_v4.Sheets, private id?: string) {}

    async resolve() {
        if (!this.id) {
            throw new Error('cannot resolve spreadsheet. no id was given!')
        }

        this.spreadsheet = (await this.api.spreadsheets.get({
            spreadsheetId: this.id,
            fields: '*'
        })).data
    }

    getSheet(indexOrTitle: SheetIdentifier): Schema$Sheet {
        if (typeof indexOrTitle === 'number') {
            return this.spreadsheet.sheets.find(x => x.properties.index === indexOrTitle)
        } else {
            return this.spreadsheet.sheets.find(x => x.properties.title === indexOrTitle)
        }
    }

    private static validateTableData(data: SpreadsheetTableCell[][]) {
        let columnCount = Infinity
        for (let i in data) {
            const row = data[i];

            if (columnCount === Infinity)
                columnCount = row.length

            if (row.length !== columnCount)
                throw new Error(`GoogleSpreadsheet.validateTableData failed because of invalid column count! Expected ${columnCount} but got ${row.length} at row ${i}`)
        }
    }

    private static createValueMatrix(data: SpreadsheetTableCell[][]): { dimension: { x: number, y: number }, data: any[][] } {
        this.validateTableData(data)

        const result = []

        for (let row of data) {
            result.push(row.map(x => x.value))
        }

        return {
            dimension: { x: data[0]?.length || 0, y: data.length },
            data: result
        }
    }

    getSpreadsheetApi(): Resource$Spreadsheets {
        return this.api.spreadsheets
    }

    async addTable(options: SpreadsheetTableOptions) {
        const matrix = GoogleSpreadsheet.createValueMatrix(options.cells)
        const sheet = this.getSheet(options.sheet)

        const res = await this.api.spreadsheets.batchUpdate({
            spreadsheetId: this.id,
            requestBody: {
                requests: [
                    {
                        updateCells: {
                            fields: '*',
                            range: {
                                sheetId: sheet.properties.sheetId,
                                startRowIndex: options.startRow,
                                endRowIndex: options.startRow + matrix.dimension.y,
                                startColumnIndex: options.startCol,
                                endColumnIndex: options.startCol + matrix.dimension.x
                            },
                            rows: options.cells.map(x => ({
                                values: x.map(cell => {
                                    return {
                                        formattedValue: cell.value,
                                        userEnteredFormat: {
                                            backgroundColor: cell.backgroundColor,
                                            textFormat: {
                                                foregroundColor: cell.textColor
                                            }
                                        }
                                    }
                                })
                            }))
                        }
                    }
                ]
            }
        })

        console.log('res', res)
    }
}
