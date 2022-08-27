import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction} from 'discord.js';

export class InfoCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    constructor() {
        super('info', 'shows dkp info')
    }

    handle(interaction: CommandInteraction) {
        interaction.reply('info')
    }
}
