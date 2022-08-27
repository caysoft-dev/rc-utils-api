import {PlayerClass} from '../types';

export class RaidMember {
    name: string;
    class: PlayerClass;
    spec: string;
    roles: any[]

    constructor(name: string, _class: PlayerClass) {
        this.name = name;
        this.class = _class;
        this.roles = []
    }
}
