import {config as loadConfig}  from 'dotenv'
import './lib/utils/string-utils';

import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sessionStore from 'connect-mongodb-session';
import bodyParser from 'body-parser';

import {Server} from '#/server';
import {DependencyInjection} from '#/reflection/dependency-injection';
import {DatabaseFactory} from '#/database/database-factory';
import {AuthEndpoint} from '#/auth/auth-endpoint';
import {DISCORD_RAID_HELPER_USER_ID, DiscordService} from '#/discord/discord-service';
import {UserService} from '#/auth/user-service';
import {GoogleApiService} from '#/google/google-api-service';
import {WclApi} from '#/wcl/v2';

loadConfig({ debug: true })

const config = {
    wcl: {
        guildId: +process.env.WCL_GUILDID,
        username: process.env.WCL_USERNAME,
        password: process.env.WCL_PASSWORD
    },
    discord: {
        applicationId: process.env.APPLICATION_ID,
        guildId: process.env.GUILD_ID,
        token: process.env.DISCORD_TOKEN
    },
    google: {
        type: 'service_account',
        project_id: '',
        private_key_id: '',
        private_key: '',
        client_email: '',
        client_id: '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/mhc-769%40mhc-rp.iam.gserviceaccount.com'
    }
}

DependencyInjection.register('config', config)
DependencyInjection.register('config#discord', config.discord)
DependencyInjection.register('config#google', config.google)
DependencyInjection.register('config#wcl', config.wcl)

const MongoDBStore = sessionStore(session)
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'session'
})

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('changeme:P'));
app.use(session({secret: 'changeme:P', resave: true, saveUninitialized: true, store: store}));

new DatabaseFactory().connect().then(async db => {
    DependencyInjection.register('database', db)
    const googleApi = new GoogleApiService()
    //await googleApi.connect()
    DependencyInjection.register('google-api', googleApi)

    DependencyInjection.register('wcl/v2', new WclApi()).login(config.wcl.username, config.wcl.password)

    const userService = DependencyInjection.register('user-service', new UserService())
    const discord = await DependencyInjection.register('discord',
        new DiscordService(config.discord.guildId)
    ).login(config.discord.token)

    await discord.ready()
    await discord.commands().publish()

    discord.enableMessageObserver()
    discord.observeUserMessages(DISCORD_RAID_HELPER_USER_ID).subscribe(e => {
        console.log(`message: type=${e.type}`)
    })

    discord.observeRaidSignUps('*').subscribe(event => {
        console.log(event)
    })

    DependencyInjection.register('auth', new AuthEndpoint(app, db, userService, discord))
    DependencyInjection.register('server', new Server(app)).configure().start()
})

