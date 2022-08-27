import {Application} from 'express';
import {registerController} from './controllers';
import {PlayerController} from './api/player-controller';
import {GuildMemberController} from './api/guild-member-controller';
import {AdminController} from './api/admin-controller';
import {GuildRankController} from './api/guild-rank-controller';
import {ToolsController} from '#/api/tools-controller';

export class Server {
    private readonly _app: Application;

    get app(): Application { return this._app }

    constructor(app: Application) {
        this._app = app
    }

    configure(): Server {
        registerController(AdminController)
        registerController(GuildMemberController)
        registerController(GuildRankController)
        registerController(PlayerController)
        registerController(ToolsController)
        return this
    }

    start(): Server {
        console.log('listening to port 3000')
        this.app.listen(3000)
        return this
    }
}
