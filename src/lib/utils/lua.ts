import {parse} from 'lua-json'

export function lua2json(luaTable: string): object {
    return parse(luaTable)
}
