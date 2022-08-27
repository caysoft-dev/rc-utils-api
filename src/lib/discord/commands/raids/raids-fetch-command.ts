import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction} from 'discord.js';
import {GuildAttendanceService} from '#/wcl/guild-attendance-service';
import moment from 'moment';

export class RaidsFetchCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    constructor(parent: DiscordCommand) {
        super('fetch', 'fetch latest raids from warcraftlogs', parent)
    }

    async handle(interaction: CommandInteraction) {
        await interaction.reply('fetching latest raid reports from warcraftlogs')

        const service = new GuildAttendanceService()
        await service.fetchAttendance(1010)

        interaction.channel.send('raid data has been updated')
    }
}
