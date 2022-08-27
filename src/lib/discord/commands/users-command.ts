import {DiscordCommand} from '#/discord/discord-command';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {SlashCommandSubcommandGroupBuilder} from '@discordjs/builders';
import {UsersListCommand} from '#/discord/commands/users/users-list-command';
import {UsersShowCommand} from '#/discord/commands/users/users-show-command';
import {CommandInteraction} from 'discord.js';

export class UsersCommand extends DiscordBaseCommand<SlashCommandSubcommandGroupBuilder> implements DiscordCommand {
    constructor() {
        super('users', 'users subcommand group')
        new UsersShowCommand(this)
        new UsersListCommand(this)
    }

    handle(interaction: CommandInteraction) {}
}
