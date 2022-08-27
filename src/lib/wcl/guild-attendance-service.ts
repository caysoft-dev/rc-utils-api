import {inject, service} from '#/reflection/inject';
import {graphql_attendance_query} from '#/wcl/v2/queries';
import {WclApi} from '#/wcl/v2';
import {Db} from 'mongodb';

@service()
export class GuildAttendanceService {
    private readonly api: WclApi
    private readonly db: Db
    private readonly guildId: number

    private attendance: any[][] = []

    constructor(@inject('wcl/v2') api?: WclApi, @inject('db') db?: Db, @inject('config#wcl') config?: { guildId: number }) {
        this.api = api
        this.db = db
        this.guildId = config.guildId
    }

    async getAttendance(zoneId: number): Promise<any[]> {
        if (!this.attendance[zoneId])
            await this.fetchAttendance(zoneId)
        return this.attendance[zoneId]
    }

    async fetchAttendance(zoneId: number) {
        const result = await this.api.query(
            graphql_attendance_query(this.guildId, zoneId)
        )
        this.attendance[zoneId] = result.data?.guildData?.guild.attendance.data
    }
}
