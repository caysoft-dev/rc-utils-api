export const __controllers__ = []

export function registerController<T>(controller: new () => T) {
    const instance = new controller()
    __controllers__.push(instance)
    return instance
}
