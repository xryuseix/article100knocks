export type Bindings = {
    DB: D1Database;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_CLIENT_ID: string;
    WORKER_TOKEN: string;
}

export type HonoAppContext = { Bindings: Bindings };