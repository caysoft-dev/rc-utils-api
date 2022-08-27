import {Server} from '../server';
import {Request, Response} from 'express';
import {inject, service} from '../reflection/inject';
import {AuthEndpoint} from '../auth/auth-endpoint';

@service()
export class BaseController {
    protected readonly baseRoute: string;
    protected readonly authRequired: boolean;

    protected readonly server: Server;

    constructor(baseRoute: string,
                @inject('server') server?: Server,
                @inject('auth') authEndpoint?: AuthEndpoint)
    {
        this.baseRoute = baseRoute
        this.authRequired = true
        this.server = server

        authEndpoint.protect(baseRoute)

        this.server.app.get(this.baseRoute, (req, res, next) => this._callMethod('get', req, res, next))
        this.server.app.get(`${this.baseRoute}/:id`, (req, res, next) => this._callMethod('getById', req, res, next))
        this.server.app.post(this.baseRoute, (req, res, next) => this._callMethod('post', req, res, next))
        this.server.app.put(`${this.baseRoute}`, (req, res, next) => this._callMethod('replaceMany', req, res, next))
        this.server.app.put(`${this.baseRoute}/:id`, (req, res, next) => this._callMethod('replaceOne', req, res, next))
        this.server.app.delete(`${this.baseRoute}/:id`, (req, res, next) => this._callMethod('delete', req, res, next))
    }

    protected register(httpMethod: string, name: string, route: string) {
        const separator = route.startsWith('/') ? '' : '/'
        this.server.app[httpMethod](`${this.baseRoute}${separator}${route}`, (req, res, next) => this._callMethod(name, req, res, next))
    }

    private async _callMethod(method: string, req: Request, res: Response, next): Promise<any> {
        if (this.authRequired) {
            //console.log(req)
        }

        if (this[method]) {
            const result = await this[method](req, res, next)
            return res.status(200).json(result)
        }

        next()
    }
}
