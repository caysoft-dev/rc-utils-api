import {HttpClient} from '#/http/client/http-client';
import moment, {Moment} from 'moment';

export type AuthResult = {
    token_type: string
    expires_in: number
    access_token: string
    created_at?: Moment
    exp_time?: Moment
}

export class WclApi {
    private readonly http: HttpClient

    private username: string
    private password: string

    private auth: AuthResult

    constructor() {
        this.http = new HttpClient({
            baseURL: 'https://classic.warcraftlogs.com',
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    login(username: string, password: string) {
        this.username = username
        this.password = password
    }

    isAuthenticated(): boolean {
        if (!this.auth)
            return false

        return this.auth.exp_time.isAfter(moment())
    }

    private async fetchToken() {
        if (this.isAuthenticated())
            return

        const authEndpoint = new HttpClient({
            baseURL: 'https://classic.warcraftlogs.com',
            auth: {
                username: this.username,
                password: this.password
            }
        })

        const result = await authEndpoint.post<AuthResult>('/oauth/token', {
            grant_type: 'client_credentials'
        })

        this.auth = result.data
        this.auth.created_at = moment()
        this.auth.exp_time = moment(this.auth.created_at).add(result.data.expires_in, 'seconds')
        this.http.config.headers['authorization'] = `Bearer ${result.data.access_token}`
    }

    async query(query: string): Promise<any> {
        try {
            await this.fetchToken()
            return (await this.http.request({
                url: '/api/v2/client',
                data: { query: query }
            })).data
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
