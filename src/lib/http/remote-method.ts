import {Request, Response} from 'express';

export interface RemoteMethod<T = unknown> {
    get?(request: Request, response: Response): T | Promise<T> | T[] | Promise<T[]>;

    post?(request: Request, response: Response): void | Promise<void>;

    put?(request: Request, response: Response): void | Promise<void>;

    patch?(request: Request, response: Response): void | Promise<void>;

    delete?(request: Request, response: Response): void | Promise<void>;

    option?(request: Request, response: Response): void | Promise<void>;

    head?(request: Request, response: Response): void | Promise<void>;
}
