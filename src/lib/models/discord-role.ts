export type DiscordRole = {
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
}
