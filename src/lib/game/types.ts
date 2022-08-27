export type PlayerClass = 'druid' | 'hunter' | 'mage' | 'paladin' | 'priest' | 'rogue' | 'shaman' | 'warlock' | 'warrior'
export type PlayerClassSpec = (
    'druid_balance' | 'druid_feral' | 'druid_guardian' | 'druid_restoration' |
    'hunter_bm' | 'hunter_mm' | 'hunter_survival' |
    'mage_arcane' | 'mage_fire' | ''
)
export const PlayerClassColors = {
    druid: { red: 1.00, green: 0.49, blue: 0.04 },
    hunter: { red: 0.67, green: 0.83, blue: 0.45 },
    mage: { red: 0.25, green: 0.78, blue: 0.92 },
    paladin: { red: 0.96, green: 0.55, blue: 0.73 },
    priest: { red: 1.00, green: 1.00, blue: 1.00 },
    rogue: { red: 1.00, green: 0.96, blue: 0.41 },
    shaman: { red: 0.00, green: 0.44, blue: 0.87 },
    warlock: { red: 0.53, green: 0.53, blue: 0.93 },
    warrior: { red: 0.78, green: 0.61, blue: 0.43 },
}
