import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import * as fs from 'fs'
import { Config } from 'src/config/dto';

@Injectable()
export class HandlerEventModule {
    
    constructor(
        private client: Client,
        private config: Config
    ) { }

    run() {
        let count = 0
        for (const file of fs.readdirSync(
            './src/events',
            { withFileTypes: true })
            .filter(file => file.isFile())
            .map(file => file.name)) {
            if (!file.endsWith('.js')) continue
            try {
                const event = require(`../../events/${file}`)
                if (typeof event !== 'function') continue

                const eventName = file.slice(0, file.indexOf('.js'))
                this.client.on(eventName, event.bind(null, this.config, this.client))
                count++
            } catch (error) {
                console.log(error);
                continue
            }
        }

        return count > 0 ? console.log(`🟢 ${count} events đã sẵn sàng!`) : console.log(`🔴 ${count} events đã sẵn sàng!`)
    }
}
