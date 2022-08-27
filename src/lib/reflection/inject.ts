import 'reflect-metadata';
import {DependencyInjection} from './dependency-injection';

export interface Injection {
    index: number;
    key: string;
}

export function inject(key: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const injection: Injection = { index: parameterIndex, key }
        const existingInjections: Injection[] = (target as any).injections || []
        if (target['injections']) {
            target['injections'] = [...existingInjections, injection]
        } else {
            Object.defineProperty(target, "injections", {
                enumerable: false,
                configurable: true,
                writable: true,
                value: [...existingInjections, injection]
            })
        }
    }
}

export function service() {
    return function service<T extends { new (...args: any[]): {} }>(constructor: T): T | void {
        return class extends constructor {
            constructor(...args: any[]) {
                const injections = (constructor as any).injections as Injection[]
                injections.forEach(({key, index}) => {
                    args[index] = DependencyInjection.get(key)
                })
                super(...args);
            }
        }
    }
}
