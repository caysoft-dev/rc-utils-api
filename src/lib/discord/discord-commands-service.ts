import {SlashCommandBuilder} from '@discordjs/builders';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';

import {inject, service} from '#/reflection/inject';
import {CommandInteraction} from 'discord.js';
import {DiscordCommand} from '#/discord/discord-command';
import {InfoCommand} from '#/discord/commands/info-command';
import {UsersCommand} from '#/discord/commands/users-command';
import {DiscordCommandRegister} from '#/discord/discord-command-register';
import {SimCommand} from '#/discord/commands/sim-command';
import {RaidsCommand} from '#/discord/commands/raids-command';

@service()
export class DiscordCommandsService {
    private readonly commands: DiscordCommand[];

    private rest: REST;
    private config: any;

    constructor(@inject('config#discord') config?: any) {
        this.config = config
        this.rest = new REST({ version: '9' }).setToken(config.token);

        this.commands = [
            new InfoCommand(),
            new UsersCommand(),
            new SimCommand(),
            new RaidsCommand()
        ]
    }

    request(interaction: CommandInteraction) {
        const command = DiscordCommandRegister.instance().getCommandInstance(interaction)
        if (command) {
            command.handle(interaction)
        }
    }

    async publish() {
        let command = new SlashCommandBuilder()
            .setName('mhcdkp')
            .setDescription('DKP/Raid management commands')

        for (let cmd of this.commands) {
            cmd.build(command)
        }

        const commands = [command.toJSON()]
        const route = Routes.applicationGuildCommands(this.config.applicationId, this.config.guildId)

        try {
            await this.rest.put(route, {
                body: commands
            })
        } catch (e) {
            console.error(e)
        }
    }
}
