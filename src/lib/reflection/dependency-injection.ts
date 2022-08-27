export class DependencyInjection {
    static registry: {[index: string]: any} = {}

    static register<T>(token: string, instance: T): T {
        this.registry[token] = instance
        return instance
    }

    static get<T=any>(token: string): T {
        if (!this.registry[token])
            return null;
        return this.registry[token]
    }
}
