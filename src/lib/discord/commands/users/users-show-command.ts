import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction} from 'discord.js';

export class UsersShowCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    constructor(parent: DiscordCommand) {
        super('show', 'shows user info', parent)
    }

    handle(interaction: CommandInteraction) {
        interaction.reply('show')
    }
}
