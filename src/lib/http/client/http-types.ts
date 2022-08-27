export interface HttpClientInterface {
    request<T=unknown>(options?: HttpRequestOptions): Promise<HttpResponse<T>>
    get<T=unknown>(url?: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    post<T=unknown>(url?: string, data?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    put<T=unknown>(url?: string, data?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    patch<T=unknown>(url?: string, data?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    delete<T=unknown>(url?: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    head<T=unknown>(url?: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    options<T = unknown>(url?: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
}

export interface HttpResponse<T = unknown>  {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
  config: HttpRequestOptions;
  request?: unknown;
}

export interface HttpRequestOptions {
  url?: string;
  method?: HttpMethod;
  baseURL?: string;
  headers?: HttpHeaders;
  params?: HttpQueryParameters;
  data?: unknown;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  auth?: {
    username: string;
    password: string;
  };
  responseType?: HttpResponseType;
  httpAgent?: any;
  httpsAgent?: any;
}

export type HttpHeaders = { [index: string]: string | number }
export type HttpQueryParameterValue = number | string | Array<string>
export type HttpQueryParameters = { [index: string]: HttpQueryParameterValue }

export type HttpMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export type HttpResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'

