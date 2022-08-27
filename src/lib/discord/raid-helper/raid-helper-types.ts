export interface RaidHelperSignup {
    role: string;
    name: string;
    spec_emote: string;
    signuptime: number;
    position: number;
    role_emote: string;
    class_emote: string;
    userid: string;
    class: string;
    spec: string;
    timestamp: Date;
    status: string;
}

export interface RaidHelperAdvanced {
    show_header: boolean;
    bench_emote: string;
    color: string;
    poll_type: string;
    limit_per_user: number;
    tentative_emote: string;
    apply_unregister: boolean;
    spec_saving: boolean;
    show_content: boolean;
    event_type: string;
    deletion: string;
    limit: number;
    mention_mode: boolean;
    bench_overflow: boolean;
    show_emotes: boolean;
    defaults_pre_req: boolean;
    deadline: string;
    show_localtime: boolean;
    horizontal_mode: boolean;
    image: string;
    thumbnail: string;
    show_countdown: boolean;
    show_footer: boolean;
    apply_specreset: boolean;
    allow_duplicate: boolean;
    bold_all: boolean;
    show_classes: boolean;
    alt_names: boolean;
    font_style: string;
    strawpoll_type: string;
    temp_role: string;
    preserve_order: string;
    allowed_roles: string;
    queue_bench: boolean;
    force_reminders: string;
    show_roles: boolean;
    show_zonedtime: boolean;
    show_title: boolean;
    response: string;
    mentions: string;
    show_info: boolean;
    lock_at_limit: boolean;
    late_emote: string;
    disable_archiving: boolean;
    absence_emote: string;
    show_numbering: boolean;
    show_allowed: boolean;
    attendance: string;
}

export interface RaidHelperClass {
    amount: number;
    name: string;
    emote: string;
}

export interface RaidHelperRole {
    amount: number;
    name: string;
    emote: string;
}

export interface RaidHelperAnnouncement {
    channel: string;
    time: string;
    message: string;
}

export interface RaidHelperEvent {
    status?: string;
    date: string;
    template: string;
    unixtime: number;
    last_updated: number;
    signups: RaidHelperSignup[];
    leadername: string;
    color: string;
    advanced: RaidHelperAdvanced;
    classes: RaidHelperClass[];
    roles: RaidHelperRole[];
    closingtime: number;
    servericon: string;
    description: string;
    title: string;
    serverid: string;
    leaderid: string;
    raidid: string;
    servername: string;
    channelName: string;
    time: string;
    channelid: string;
    announcement: RaidHelperAnnouncement;
}
