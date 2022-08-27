import {irregularCharactersMap, regularCharacters} from './string-utils.data';

export type StringUtils_ToLatinOptions = { noMatchReplacement?: string }

export function toLatin(options?: StringUtils_ToLatinOptions): string {
    let result = []
    let value = String(this).normalize()

    for (let i = 0; i < value.length; ++i) {
        let char = value.charAt(i)
        let newChar = irregularCharactersMap[char] || char
        if (!regularCharacters.includes(newChar)) {
            newChar = options?.noMatchReplacement || 'z'
        }
        result.push(newChar)
    }

    return result.join('')
}

declare global {
    interface String {
        toLatin(options?: StringUtils_ToLatinOptions): string;
    }
}
String.prototype.toLatin = toLatin;
