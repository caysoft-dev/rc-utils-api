import {HttpClientInterface} from '../../http/client/http-types';
import {HttpClient} from '../../http/client/http-client';
import {RaidHelperEvent} from './raid-helper-types';
import {HttpBulkRequest} from '../../http/client/http-bulk-request';
import {filter} from 'rxjs';

export class RaidHelperApi {
    private readonly http: HttpClientInterface;

    constructor() {
        this.http = new HttpClient({ baseURL: 'https://raid-helper.dev/api' })
    }

    async getEvent(id: string): Promise<RaidHelperEvent | null> {
        const response = await this.http.get<RaidHelperEvent>(`/event/${id}`)
        return response.data || null
    }

    getEventBulk(ids: string[]): Promise<RaidHelperEvent[]> {
        return new Promise<RaidHelperEvent[]>((resolve, reject) => {
            const result = []
            const bulkRequest = new HttpBulkRequest(this.http)
            bulkRequest.sendBulkRequest<RaidHelperEvent>(ids.map(id => (
                { method: 'get', url: `/event/${id}` })),
                { delay: 250 }
            ).pipe(
                filter(res => res.data.status !== 'failed')
            ).subscribe({
                next: (res) => result.push(res.data),
                error: (error) => reject(error),
                complete: () => resolve(result)
            })
        })
    }
}
