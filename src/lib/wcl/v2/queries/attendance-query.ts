export function graphql_attendance_query(guildId: number, zoneId: number): string {
    // language=GraphQL
    return `{
        guildData {
            guild(id: ${guildId}) {
                id,
                attendance(zoneID: ${zoneId}) {
                    data {
                        code
                        startTime
                        zone {
                            id,
                            name
                        }
                        players {
                            name,
                            type,
                            presence
                        }
                    }
                }
            }
        }
    }`
}
