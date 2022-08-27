import moment, {Moment} from 'moment';

export interface DiscordRaidMessage {
    type: string;
    description: string;
    fields: {
        name: string;
        value: string;
        inline: boolean
    }[]
}

export class DiscordRaid {
    time: Moment;
    players: any[];

    constructor(private readonly data: DiscordRaidMessage) {
        this.parse()
    }

    private isPlayerEntry(line: string): boolean {
        const playerTags = ['Balance', 'Guardian', 'Feral', 'Restoration', 'Beastmastery', 'Marksmanship', 'Survival', 'Arcane', 'Fire', 'Frost', 'Holy1', 'Protection1', 'Retribution', 'Discipline', 'Holy', 'Shadow', 'Assassination', 'Combat', 'Subtlety', 'Elemental', 'Enhancement', 'Restoration1', 'Affliction', 'Demonology', 'Destruction', 'Arms', 'Fury', 'Protection']
        for (let tag of playerTags)
            if (line.startsWith(`<:${tag}`))
                return true
        return false
    }

    private isTimeEntry(line: string): boolean {
        if (!line.startsWith('<:CMcalendar'))
            return false

        const exp = /t:(.*?):/g
        const match = [...line.matchAll(exp)];
        return match.length > 0
    }

    private parseTime(line: string) {
        const exp = /t:(.*?):/g
        const match = [...line.matchAll(exp)];
        return moment.unix(+match[0][1])
    }

    private parsePlayer(line: string) {
        const role = line.split(':')[1]
        const name = line.split('**')[1]
        return {
            name: name,
            role: role
        }
    }

    private parse() {
        const players = []
        for (let field of this.data.fields) {
            const entries = field.value.split('\n')
            for (let entry of entries) {
                if (this.isPlayerEntry(entry)) {
                    players.push(this.parsePlayer(entry))
                } else if (this.isTimeEntry(entry)) {
                    this.time = this.parseTime(entry)
                    console.log('time', this.time.toISOString())
                }
            }
        }
        this.players = players
    }
}
