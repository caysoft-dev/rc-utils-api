import {DKP_SIM_RAID_DATA as data} from './data'

export function roll(chance) {
    return Math.random() <= chance
}

export class RaidGroup {
    armorPrice?: number
    weaponPrice?: number

    data: any[];
    printEnabled: boolean;
    printHandler = (m) => console.log(m)

    constructor(group = []) {
        this.data = group
    }

    setPrintEnabled(enabled) {
        this.printEnabled = enabled
    }

    print(out) {
        if (this.printEnabled)
            this.printHandler(out)
    }

    addPlayer(player) {
        this.data.push(player)
    }

    decayPoints(pct) {
        this.print(`applying ${pct * 100}% decay\n`)

        for (let player of this.data) {
            if (player.points > 0) {
                const decay = Math.floor((player.points * pct))
                player.points = player.points - decay

                if (player.decay === undefined) {
                    player.decay = 0
                }
                player.decay += decay
            }
        }
    }

    modifyPoints(points, player = null) {
        const savePlayerPoints = (player, points) => {
            if (player.spentPoints === undefined)
                player.spentPoints = 0
            if (player.gainedPoints === undefined)
                player.gainedPoints = 0

            if (points > 0) {
                player.gainedPoints += points
            } else {
                player.spentPoints += (points * -1)
            }

            player.points += points
        }

        this.print(`${player ? '  > '+player.name : '> raid'} ${points > 0 ? '+' : ''}${points} points`)

        if (!player) {
            for (let player of this.data) {
                savePlayerPoints(player, points)
            }
        } else {
            const idx = this.data.findIndex(x => x.name === player.name)
            if (idx >= 0) {
                savePlayerPoints(this.data[idx], points)
            }
        }
    }

    printPointsTable() {
        this.printHandler(`${'name'.padEnd(14)} ${'points'.padEnd(8)} ${'items'.padEnd(8)} ${'spent'.padEnd(8)} ${'gained'.padEnd(8)} decay`)
        this.printHandler('-------------------------------------------------------------')
        const players = this.data.sort((a,b) => a.points > b.points ? -1 : 1)
        for (let player of players) {
            this.printHandler(`${player.name.toString().padEnd(14)} ${player.points.toString().padEnd(8)} ${player.loot.length.toString().padEnd(8)} ${player.spentPoints.toString().padEnd(8)} ${player.gainedPoints.toString().padEnd(8)} ${(player.decay||0)}`)
        }
    }

    handleLoot(loot) {
        const isInterested = (player) => {
            const interestCount = 12 - player.loot.length
            const interestChance = (interestCount > 0) ? ((interestCount / 12) / 2) : 0
            return roll(interestChance)
        }

        const interestedPlayers = this.data.filter(x => isInterested(x))
        const topPlayer = interestedPlayers.sort((a,b) => a.points > b.points ? -1 : 1)[0]
        if (!topPlayer) {
            this.print(`  > ${loot.name} is being disenchanted`)
            return
        }

        if (loot.name == 'Armor' && this.armorPrice !== undefined)
            loot.points = this.armorPrice

        if (loot.name == 'Weapon' && this.weaponPrice !== undefined)
            loot.points = this.weaponPrice

        this.print(`  > ${topPlayer.name} wins ${loot.name}`)
        this.modifyPoints(-loot.points, topPlayer)

        const idx = this.data.findIndex(x => x.name === topPlayer.name)
        if (idx >= 0)
            this.data[idx].loot.push(loot)
    }
}

export class Raid {
    currentBoss: number;
    totalAttempts: number;
    raidGroup: RaidGroup;
    printEnabled: boolean;
    data: any;
    bosses: any[];

    printHandler = (m) => console.log(m)

    constructor(id) {
        this.currentBoss = 0
        this.totalAttempts = 0
        this.raidGroup = null
        this.printEnabled = false
        this.data = data.raids.find(x => x.id === id)
        this.bosses = []
    }

    setPrintEnabled(enabled) {
        this.printEnabled = enabled
    }

    setRaidGroup(group) {
        this.raidGroup = group
    }

    getBoss(index?: number) {
        if (index === undefined)
            index = this.currentBoss

        if (this.raidGroup === null)
            throw new Error('raidGroup must be set')

        if (!this.bosses[index])
            this.bosses[index] = new RaidBoss(this, this.data.bosses[index])

        return this.bosses[index]
    }

    restart() {
        this.currentBoss = 0
        this.totalAttempts = 0
        this.bosses.forEach(x => x.killed = false)
    }

    print(out) {
        if (this.printEnabled)
            this.printHandler(out)
    }

    distributeLoot(boss) {
        const getLoot = (entry) => {
            if (entry.amount) {
                for (let item of entry.items) {
                    if (roll(item.chance)) {
                        return item
                    }
                }
                return entry.items[0]
            }
            return entry
        }

        this.print(`> distributing loot`)

        const loot = boss.data.loot.map(x => getLoot(x))
        for (let entry of loot) {
            this.raidGroup.handleLoot(entry)
        }
    }

    nextAttempt() {
        this.totalAttempts++
        const boss = this.getBoss()
        const killed = boss.attempt()
        const isLastAttempt = !(this.totalAttempts < this.data.max_attempts)
        const isLastBoss = this.currentBoss === (this.data.bosses.length - 1)

        if (killed) {
            this.currentBoss++
            this.print(`${boss.data.name} has been defeated`)
            this.raidGroup.modifyPoints(boss.data.points)

            this.distributeLoot(boss)

            if (isLastBoss) {
                this.print('\nRaid has been completed')
                return true
            }

            this.print(`\n`)
        } else {
            this.print(`${boss.data.name} wipe`)
        }

        return isLastAttempt
    }
}

export class RaidBoss {
    private progressing: boolean;
    private attempts: number;
    private killed: boolean;
    private raid: any;
    private data: any;

    constructor(raid, boss) {
        this.data = boss
        this.raid = raid
        this.killed = false
        this.attempts = 0
        this.progressing = true
    }

    isComplete() {
        return !!this.killed
    }

    attempt() {
        const wipeChance = this.progressing ? this.data.progress_wipe_chance : 0
        const isWipe = roll(wipeChance)
        this.killed = !isWipe
        this.attempts++

        if (this.killed)
            this.progressing = false

        return this.killed
    }
}
