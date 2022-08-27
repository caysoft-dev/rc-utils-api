import {Client, Intents} from 'discord.js'
import {REST} from '@discordjs/rest'
import {URLSearchParams} from 'url';
import {DiscordRaid} from './types/discord-raid';
import {RaidHelperApi} from './raid-helper';
import {RaidHelperEvent} from './raid-helper';
import {DiscordChannelMessageWidget} from './types/discord-channel-message-widget';
import {concatMap, filter, Observable, Subject} from 'rxjs';
import {DiscordCommandsService} from './discord-commands-service';
import {UserService} from '#/auth/user-service';
import {DiscordRole} from '#/models/discord-role';

export const DISCORD_RAID_HELPER_USER_ID = '579155972115660803'

export class DiscordService {
    private readonly client: Client;
    private readonly rest: REST;
    private readonly userService: UserService;
    private readonly guildId: string;
    private readonly messageStream: Subject<any>;
    private readonly _ready: Promise<void>;

    private commandsService: DiscordCommandsService;

    constructor(guildId: string) {
        this.guildId = guildId
        this.messageStream = new Subject<any>()
        this.userService = new UserService()
        this.rest = new REST()
        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
        })

        this._ready = new Promise<void>(resolve => {
            this.client.on('ready', args => {
                console.log('ready', args)
                resolve()
            })
        })
    }

    async login(token: string): Promise<DiscordService> {
        this.rest.setToken(token)
        await this.client.login(token)
        await this.client.user.setStatus('online')
        return this
    }

    async sendMessage(message: string, channel: string = '859405363924959232') {
        await this.rest.post(`/channels/${channel}/messages`, {
            body: {
                content: message
            }
        })
    }

    async deleteChannelMessages(id) {
        const params = new URLSearchParams()
        params.append('limit', '20')
        const messages = (await this.rest.get(`/channels/${id}/messages`, { query: params }) as any).map(x => x.id)
        if (messages.length < 2)
            return

        await this.rest.post(`/channels/${id}/messages/bulk-delete`, {
            body: {
                messages: messages
            }
        })
    }

    async getGuildMember(id: string, updateCache?: boolean): Promise<any> {
        const player = await this.rest.get(`/guilds/${this.guildId}/members/${id}`) as any

        if (!player)
            return null

        await this.userService.updatePlayer(player.user.id, {
            username: player.user.username,
            discriminator: player.user.discriminator,
            avatar: player.user.avatar,
            nick: player.nick || player.user.username,
            roles: player.roles
        })

        return await this.userService.getPlayer(player.user.id)
    }

    async getGuildRoles(): Promise<DiscordRole[]> {
        return (await this.rest.get(`/guilds/${this.guildId}/roles`)) as DiscordRole[]
    }

    async resolvePlayer(nick: string, forceReload: boolean = true) {
        if (!forceReload) {
            const existingPlayer = await this.userService.getPlayerByNickname(nick)
            if (existingPlayer) {
                if (existingPlayer.nick !== nick)
                    await this.userService.updatePlayerNick(existingPlayer._id, nick)
                return existingPlayer
            }
        }

        const query = new URLSearchParams(`query=${nick}`)
        const searchResult = await this.rest.get(`/guilds/${this.guildId}/members/search`, { query: query }) as any
        const player = searchResult[0]

        if (!player)
            return null

        await this.userService.updatePlayer(player.user.id, {
            username: player.user.username,
            discriminator: player.user.discriminator,
            avatar: player.user.avatar,
            nick: player.nick || player.user.username,
            characters: [],
            roles: []
        })

        return await this.userService.getPlayer(player.user.id)
    }

    async findRaids(): Promise<DiscordChannelMessageWidget<RaidHelperEvent>[]> {
        const params = new URLSearchParams()
        params.append('limit', '20')

        const raidHelper = new RaidHelperApi()
        const widgets: {[key: string]: DiscordChannelMessageWidget} = {}
        const channels = (await this.rest.get(`/guilds/${this.guildId}/channels`) as any).filter(x => x.type === 0)
        for (let channel of channels) {
            const messages = (await this.rest.get(`/channels/${channel.id}/messages`, { query: params }) as any)
            for (let message of messages) {
                const isRaidHelper= message.author.username === 'Raid-Helper' && message.author.bot
                if (isRaidHelper) {
                    widgets[message.id] = {
                        channel: channel,
                        message: message,
                        widget: null
                    }
                }
            }
        }

        const result = await raidHelper.getEventBulk(Object.keys(widgets))
        for (let event of result) {
            widgets[event.raidid].widget = event
        }

        return Object.values(widgets).filter(x => !!x.widget)
    }

    async getRaidsFromChannel(channelId: string) {
        const raids = []
        const messages = await this.rest.get(`/channels/${channelId}/messages`) as any
        for (let message of messages) {
            if (message.author.username === 'Raid-Helper' && message.author.bot) {
                const raid = new DiscordRaid(message.embeds[0])
                for (let player of raid.players) {
                    player.user = await this.resolvePlayer(player.name)
                    console.log('g', player)
                }
                raids.push(raid)
            }
        }
    }

    observeRaidSignUps(idOrIds: string | string[]): Observable<RaidHelperEvent> {
        const raidHelper = new RaidHelperApi()
        if (idOrIds === '*') {
            idOrIds = []
        }

        if (!Array.isArray(idOrIds)) {
            idOrIds = [idOrIds]
        }

        return this
            .observeUserMessages(DISCORD_RAID_HELPER_USER_ID)
            .pipe(
                filter(x => x.type === 'update'),
                filter(x => idOrIds.length === 0 || idOrIds.includes(x.message.id)),
                concatMap(x => raidHelper.getEvent(x.message.id))
            )
    }

    observeUserMessages(userId: string): Observable<{ type: string, message: any }> {
        return this.messageStream.pipe(
            filter(x => x.message?.author?.id === userId)
        )
    }

    enableMessageObserver() {
        this.client.on('messageCreate', args => {
            this.messageStream.next({ type: 'create', message: args })
        })

        this.client.on('messageUpdate', args => {
            this.messageStream.next({ type: 'update', message: args })
        })

        this.client.on('messageDelete', args => {
            this.messageStream.next({ type: 'delete', message: args })
        })

        this.client.on('interactionCreate', interaction => {
            if (interaction.isCommand()) {
                this.commands().request(interaction)
            }
        })
    }

    ready(): Promise<void> {
        return this._ready
    }

    commands(): DiscordCommandsService {
        if (!this.commandsService)
            this.commandsService = new DiscordCommandsService()
        return this.commandsService
    }
}
