import {HttpClientInterface, HttpResponse} from './http-types';
import { AxiosInstance, AxiosRequestConfig, default as Axios } from 'axios';

export class HttpClient implements HttpClientInterface {
    public readonly config: AxiosRequestConfig;

    private readonly client: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.client = Axios.create(config)
        this.config = <any>this.client.defaults
    }

    async delete<T = unknown>(url?: string, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.delete<T, HttpResponse<T>>(url, options)
    }

    async get<T = unknown>(url?: string, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.get<T, HttpResponse<T>>(url, options)
    }

    async head<T = unknown>(url?: string, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.head<T, HttpResponse<T>>(url, options)
    }

    async options<T = unknown>(url?: string, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.options<T, HttpResponse<T>>(url, options)
    }

    async patch<T = unknown>(url?: string, data?: unknown, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.patch<T, HttpResponse<T>>(url, data, options)
    }

    async post<T = unknown>(url?: string, data?: unknown, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.post<T, HttpResponse<T>>(url, data, options)
    }

    async put<T = unknown>(url?: string, data?: unknown, options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.put<T, HttpResponse<T>>(url, data, options)
    }

    async request<T = unknown>(options?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return await this.client.request<T, HttpResponse<T>>(options)
    }
}
