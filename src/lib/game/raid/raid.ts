import {RaidMember} from './raid-member';
import {RaidGroup} from './raid-group';

export class Raid {
    groups: RaidGroup[]

    constructor(players?: RaidMember[]) {
        if (players) {
            this.groups = this.build(players)
        } else this.groups = []
    }

    private build(players: RaidMember[]): RaidGroup[] {
        const result = []

        let group = []
        for (let player of players) {
            group.push(player)

            if (group.length === 5) {
                result.push(new RaidGroup(group))
                group = []
            }
        }

        return result
    }
}
