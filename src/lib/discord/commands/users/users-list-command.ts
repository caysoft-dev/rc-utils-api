import {DiscordCommand} from '#/discord/discord-command';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {CommandInteraction} from 'discord.js';

export class UsersListCommand extends DiscordBaseCommand<SlashCommandSubcommandBuilder> implements DiscordCommand {
    constructor(parent: DiscordCommand) {
        super('list', 'lists users', parent)
    }

    handle(interaction: CommandInteraction) {
        interaction.reply('list')
    }
}
