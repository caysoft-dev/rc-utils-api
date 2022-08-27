import {HttpClientInterface, HttpRequestOptions, HttpResponse} from './http-types';
import {concatMap, interval, map, Observable, of, switchMap, take} from 'rxjs';

export type HttpBulkRequestOptions = {
    delay?: number
}

export class HttpBulkRequest {
    constructor(private http: HttpClientInterface) { }

    sendBulkRequest<T=unknown>(requests: HttpRequestOptions[], options: HttpBulkRequestOptions = {}): Observable<HttpResponse<T>> {
        return interval(options.delay || 0)
            .pipe(take(requests.length))
            .pipe(
                concatMap(async (x) => {
                    console.log(x)
                    return await this.http.request<T>(requests[x])
                })
            )
    }
}
