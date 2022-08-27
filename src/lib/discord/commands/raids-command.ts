import {DiscordCommand} from '#/discord/discord-command';
import {DiscordBaseCommand} from '#/discord/discord-base-command';
import {RaidsListCommand} from '#/discord/commands/raids/raids-list-command';
import {RaidsFetchCommand} from '#/discord/commands/raids/raids-fetch-command';
import {SlashCommandSubcommandGroupBuilder} from '@discordjs/builders';
import {CommandInteraction} from 'discord.js';

export class RaidsCommand extends DiscordBaseCommand<SlashCommandSubcommandGroupBuilder> implements DiscordCommand {
    constructor() {
        super('raids', 'raids subcommand group')
        new RaidsListCommand(this)
        new RaidsFetchCommand(this)
    }

    handle(interaction: CommandInteraction) {}
}
