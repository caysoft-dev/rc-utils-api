import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction} from 'discord.js';
import {Raid, RaidGroup} from '#/game/dkp-sim/dkp-sim';
import {DKP_SIM_ROSTER} from '#/game/dkp-sim/roster';
import {inject, service} from '#/reflection/inject';
import {DiscordService} from '#/discord/discord-service';

export const SIM_CHANNEL_ID = '929769433306632282'

@service()
export class SimCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    private readonly discord: DiscordService
    constructor(@inject('discord') discord?: DiscordService) {
        super('sim', 'simulates raid dkp development')
        this.discord = discord
    }

    setup(builder: any): any {
        (builder as SlashCommandBuilder).addNumberOption(opt => opt
            .setName('decay')
            .setDescription('weekly points decay')
            .setMinValue(0)
            .setMaxValue(1)
        ).addIntegerOption(opt => opt
            .setName('weeks')
            .setDescription('amount of weeks simulated')
            .setMinValue(1)
            .setMaxValue(50)
        ).addIntegerOption(opt => opt
            .setName('price_armor')
            .setDescription('overrides price for armor loot')
        ).addIntegerOption(opt => opt
            .setName('price_weapon')
            .setDescription('overrides price for weapon loot')
        ).addBooleanOption(opt => opt
            .setName('print_details')
            .setDescription('default: true')
        )
        return builder
    }

    async handle(interaction: CommandInteraction) {
        if (interaction.channelId !== '929769433306632282') {
            await interaction.reply('dkp simulations are not allowed in this channel')
            return
        }

        await this.discord.deleteChannelMessages(interaction.channelId)
        await interaction.reply('starting simulation')

        const WEEKLY_DECAY = interaction.options.getNumber('decay', false) || 0.1
        const TOTAL_RAIDS = interaction.options.getInteger('weeks', false) || 1
        const ARMOR_PRICE = interaction.options.getInteger('price_armor') || undefined
        const WEAPON_PRICE = interaction.options.getInteger('price_weapon') || undefined
        const PRINT_DETAILS = (() => {
            const val = interaction.options.getBoolean('print_details')
            if (val === null)
                return true
            return val
        })()

        let messages = []
        const printHandler = (m) => {
            messages.push(m)
            console.log(m)
        }

        const roster = JSON.parse(JSON.stringify(DKP_SIM_ROSTER))
        //const roster = DKP_SIM_ROSTER
        const group = new RaidGroup(roster)
        group.setPrintEnabled(PRINT_DETAILS)
        group.printHandler = printHandler
        group.armorPrice = ARMOR_PRICE
        group.weaponPrice = WEAPON_PRICE

        const btRaid = new Raid(2)
        btRaid.setRaidGroup(group)
        btRaid.setPrintEnabled(PRINT_DETAILS)
        btRaid.printHandler = printHandler

        const mhRaid = new Raid(1)
        mhRaid.setRaidGroup(group)
        mhRaid.setPrintEnabled(PRINT_DETAILS)
        mhRaid.printHandler = printHandler

        for (let i = 0; i < TOTAL_RAIDS; ++i) {
            btRaid.print('\n```------------------------------ HYJAL SUMMIT STARTED ------------------------------')
            if (i > 0) group.decayPoints(WEEKLY_DECAY)

            while (!mhRaid.nextAttempt()) {}
            mhRaid.restart()

            btRaid.print('---------------------------------------------------------------------------------------```')


            if (messages.length > 0) {
                await this.discord.sendMessage(messages.join('\n'), interaction.channelId)
                messages = []
            }

            btRaid.print('\n```------------------------------ BLACK TEMPLE STARTED ------------------------------')
            while (!btRaid.nextAttempt()) {}
            btRaid.restart()

            btRaid.print('---------------------------------------------------------------------------------------```')

            if (messages.length > 0) {
                await this.discord.sendMessage(messages.join('\n'), interaction.channelId)
                messages = []
            }
        }

        btRaid.setPrintEnabled(true)
        group.printPointsTable()
        await this.discord.sendMessage('```'+messages.join('\n')+'```', interaction.channelId)
        messages = []
    }
}
