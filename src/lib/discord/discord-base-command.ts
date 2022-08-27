import {DiscordCommand} from '#/discord/discord-command';
import {DiscordCommandRegister} from '#/discord/discord-command-register';

export abstract class DiscordBaseCommand<T = any> implements DiscordCommand<T> {
    name: string
    description: string
    subcommands: DiscordCommand[]
    parent: DiscordBaseCommand

    protected constructor(name: string, description: string, parent?: DiscordCommand) {
        this.name = name
        this.description = description
        this.subcommands = []

        if (parent) {
            this.parent = parent as DiscordBaseCommand
            this.parent.addSubcommand(this)
        }
    }

    protected addSubcommand(cmd: DiscordCommand): DiscordBaseCommand {
        this.subcommands.push(cmd)
        return this
    }

    setup(builder: any): any {
        return builder
    }

    build(builder: any): any {
        DiscordCommandRegister.instance().add(this)

        if (this.subcommands.length === 0) {
            return builder.addSubcommand(
                subcommand => this.setup(subcommand.setName(this.name).setDescription(this.description))
            )
        }

        builder.addSubcommandGroup(group => {
            group.setName(this.name).setDescription(this.description)
            for (let cmd of this.subcommands)
                cmd.build(group)
            return group
        })

        return builder
    }

    handle(args) { }
}
