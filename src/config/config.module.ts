import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import NodeCache from 'node-cache';
import { Config } from './dto';

@Injectable()
export class ConfigModule {
    constructor(
        private env?: ConfigService,
        private nodecache?: NodeCache
    ) { }
    config:Config = {
        prefix: this.env.get("PREFIX"),
        openaikey: this.env.get("OPENAI_KEY"),
        cache: this.nodecache,
        ratelimit: new Map(),
        commands: new Map(),
        aliases: new Map()
    }
}
