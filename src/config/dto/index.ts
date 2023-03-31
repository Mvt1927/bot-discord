import NodeCache from "node-cache"

export class Config {
    prefix: string
    openaikey: string
    cache: NodeCache
    ratelimit: Map<any,any>
    commands: Map<any,any>
    aliases: Map<any,any>
}