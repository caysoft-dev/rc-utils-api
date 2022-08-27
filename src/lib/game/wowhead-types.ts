import {PlayerClass} from './types';

export const WowheadClassMap: {[index: string]: PlayerClass} = {
    x: 'druid',
    v: 'druid',
    w: 'druid',
    C: 'hunter',
    F: 'hunter',
    D: 'hunter',
    d: 'mage',
    b: 'mage',
    c: 'mage',
    H: 'paladin',
    J: 'paladin',
    G: 'paladin',
    n: 'priest',
    p: 'priest',
    q: 'priest',
    k: 'rogue',
    j: 'rogue',
    m: 'rogue',
    r: 'shaman',
    t: 'shaman',
    s: 'shaman',
    z: 'warlock',
    B: 'warlock',
    y: 'warlock',
    f: 'warrior',
    h: 'warrior',
    g: 'warrior',
}


export const RAID_COMPOSITION_MAPPING = {
    "classes": {
        "druid": {
            "bal": "x",
            "fer": "v",
            "res": "w"
        },
        "hunter": {
            "bm": "C",
            "mm": "F",
            "surv": "D"
        },
        "mage": {
            "arcane": "d",
            "fire": "b",
            "frost": "c"
        },
        "paladin": {
            "holy": "H",
            "prot": "J",
            "ret": "G"
        },
        "priest": {
            "disc": "n",
            "holy": "p",
            "shadow": "q"
        },
        "rogue": {
            "assassin": "k",
            "combat": "j",
            "subtlety": "m"
        },
        "shaman": {
            "ele": "r",
            "enh": "t",
            "res": "s"
        },
        "warlock": {
            "affl": "z",
            "demo": "B",
            "dest": "y"
        },
        "warrior": {
            "arms": "f",
            "fury": "h",
            "prot": "g"
        }
    },
    "raid_planner": {
        "Balance": "x",
        "Guardian": "v",
        "Feral": "v",
        "Restoration": "w",
        "Beastmastery": "C",
        "Marksmanship": "F",
        "Survival": "D",
        "Arcane": "d",
        "Fire": "b",
        "Frost": "c",
        "Holy1": "H",
        "Protection1": "J",
        "Retribution": "G",
        "Discipline": "n",
        "Holy": "p",
        "Shadow": "q",
        "Assassination": "k",
        "Combat": "j",
        "Subtlety": "m",
        "Elemental": "r",
        "Enhancement": "t",
        "Restoration1": "s",
        "Affliction": "z",
        "Demonology": "B",
        "Destruction": "y",
        "Arms": "f",
        "Fury": "h",
        "Protection": "g"
    },
    "raid_planner_roles": {
        "Balance": "D",
        "Guardian": "T",
        "Feral": "D",
        "Restoration": "H",
        "Beastmastery": "D",
        "Marksmanship": "D",
        "Survival": "D",
        "Arcane": "D",
        "Fire": "D",
        "Frost": "D",
        "Holy1": "H",
        "Protection1": "T",
        "Retribution": "D",
        "Discipline": "H",
        "Holy": "H",
        "Shadow": "D",
        "Assassination": "D",
        "Combat": "D",
        "Subtlety": "D",
        "Elemental": "D",
        "Enhancement": "D",
        "Restoration1": "H",
        "Affliction": "D",
        "Demonology": "D",
        "Destruction": "D",
        "Arms": "D",
        "Fury": "D",
        "Protection": "T"
    }
}
