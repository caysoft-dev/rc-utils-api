import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction, MessageEmbed} from 'discord.js';
import {GuildAttendanceService} from '#/wcl/guild-attendance-service';
import moment from 'moment';

export class RaidsListCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    constructor(parent: DiscordCommand) {
        super('list', 'lists recent main raids', parent)
    }

    async handle(interaction: CommandInteraction) {
        await interaction.reply('loading raids')

        const service = new GuildAttendanceService()
        const data = await service.getAttendance(1010)
        const result = []

        let cnt = 0
        let map: {[key: string]: MessageEmbed} = {}

        data.forEach(x => {
            const dateStr = moment.unix(x.startTime/1000).format('YYYY-MM-DD')
            const zone = x.zone.name
            const url = `https://classic.warcraftlogs.com/reports/${x.code}`

            if (!map[dateStr])
                map[dateStr] = new MessageEmbed({ title: dateStr })

            map[dateStr].addField(zone, url)

            if (++cnt === 10) {
                result.push(Object.values(map))
                map = {}
                cnt = 0
            }
        })

        const lastChunk = Object.values(map)
        if (lastChunk.length > 0)
            result.push(lastChunk)

        for (let message of result) {
            await interaction.channel.send({
                embeds: message
            })
        }
    }
}
