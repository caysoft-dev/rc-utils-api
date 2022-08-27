export type Player = {
    _id?: string;
    username: string;
    nick: string;
    discriminator: string;
    avatar: string;
    roles?: string[];
    characters?: any[];
}
