import { Injectable } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import * as fs from 'fs'
import { Config } from 'src/config/dto';

@Injectable()
export class HandlerCommandModule {
    constructor(
        private config: Config,
    ) { }
    run() {
        let count = 0
        for (const dir of fs.readdirSync(
            './src/commands',
            { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map(dir => dir.name)) {

            const files = fs.readdirSync(`./src/commands/${dir}`,
                { withFileTypes: true })
                .filter(file => file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.ts')))
                .map(file => file.name)
            if (!files.length) continue

            for (const file of files) {
                try {
                    const pull = require(`../../commands/${dir}/${file}`)

                    if (pull.name) {
                        if (pull.aliases && Array.isArray(pull.aliases)) {
                            pull.aliases.forEach((alias: any) => this.config.aliases.set(alias, pull.name))
                        }
                        this.config.commands.set(pull.name, pull)
                        count++
                    } else {
                        continue
                    }
                } catch (error) {
                    continue
                }
            }
        }
        return count > 0 ? console.log(`🟢 ${count} lệnh đã sẵn sàng!`) : console.log(`🔴 ${count} lệnh đã sẵn sàng!`)
    }
}
