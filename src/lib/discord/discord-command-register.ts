import {DiscordCommand} from '#/discord/discord-command';
import {CommandInteraction} from 'discord.js';

export type DiscordCommandRegisterData = {
    [index: string]: {
        instance?: DiscordCommand
        children?: DiscordCommandRegisterData
    }
}

export class DiscordCommandRegister {
    private commands: DiscordCommandRegisterData
    private static _instance: DiscordCommandRegister

    private constructor() {
        this.commands = {
            mhcdkp: {
                children: {}
            }
        }
    }

    add(command: DiscordCommand) {
        if (command.parent) {
            return
        }

        if (this.commands['mhcdkp'].children[command.name]) {
            throw new Error('command already registered')
        }

        this.commands['mhcdkp'].children[command.name] = {
            children: {},
            instance: command
        }

        for (let cmd of command.subcommands) {
            this.commands['mhcdkp'].children[command.name].children[cmd.name] = {
                children: {},
                instance: cmd
            }
        }
    }

    getCommandInstance(interaction: CommandInteraction): DiscordCommand {
        const subCmd = interaction.options.getSubcommand(false)
        const subCmdGroup = interaction.options.getSubcommandGroup(false)
        const commandPath = [subCmdGroup, subCmd].filter(x => !!x)

        let node = this.commands[interaction.commandName]

        for (let segment of commandPath) {
            if (!node.children[segment])
                break

            node = node.children[segment]
        }

        return node?.instance
    }

    static instance(): DiscordCommandRegister {
        return this._instance || (this._instance = new DiscordCommandRegister())
    }
}
