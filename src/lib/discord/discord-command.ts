import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from '@discordjs/builders';

export type DiscordCommandBuilder = (SlashCommandBuilder & SlashCommandSubcommandBuilder & SlashCommandSubcommandGroupBuilder)
export interface DiscordCommand<T = SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder> {
    name: string
    description: string
    parent?: DiscordCommand
    subcommands: DiscordCommand[]
    build(builder: T): T
    handle(args)
}
