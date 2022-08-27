import {Db} from 'mongodb';
import passport from 'passport'
import {Strategy as DiscordStrategy} from 'passport-discord'
import {Application, Request, Response} from 'express';
import {NextFunction} from 'express-serve-static-core';
import {DiscordService} from '../discord/discord-service';
import {UserService} from './user-service';

export class AuthEndpoint {
    private app: Application;

    private readonly discord: DiscordService;
    private readonly userService: UserService;
    private readonly database: Db;
    private readonly config = {
        clientID: '764269060354867210',
        clientSecret: '4cZu1DsKv3tm8OIikCSj1ztxlPR7nTtU',
        callbackURL: 'http://localhost:4200/api/auth/callback',
        scope: ['identify']
    }

    constructor(app: Application, database: Db, userService: UserService, discord: DiscordService) {
        this.database = database
        this.app = app
        this.userService = userService
        this.discord = discord
        this.serializers()
        this.middleware()
        this.routes()
    }

    private serializers() {
        passport.serializeUser(async (user: any, done: any) => {
            const player = await this.discord.getGuildMember(user.id, true)
            done(null, player._id);
        });

        passport.deserializeUser(async (id: string, done) => {
            let error = null;
            let user = await this.userService.getPlayer(id)
            if (!user) {
                error = new Error('user not found!')
            }

            done(error, user);
        });
    }

    private middleware() {
        passport.use(new DiscordStrategy(this.config, (at, rt, profile, cb) => cb(null, profile)))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }

    private routes() {
        this.app.get('/api/auth/info', (req, res) => {
            if (!req.user) {
                return res.status(401).end('unauthorized')
            }
            return res.status(200).json(req.user)
        })

        this.app.get('/api/auth/login', passport.authenticate('discord'), (req, res) => {
            res.redirect('/');
        })

        this.app.get('/api/auth/callback', passport.authenticate('discord', { failureRedirect: '/api/auth/login' }), (req, res) => {
            res.redirect('/');
        })
    }

    private async authenticate(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).end('unauthorized')
        }
        next()
    }

    protect(path) {
        this.app.all(path, (req, res, next) => this.authenticate(req, res, next))
    }
}
