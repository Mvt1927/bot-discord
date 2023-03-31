import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as NodeCache from 'node-cache'
import * as Discord from "discord.js"
import { ConfigModule } from 'src/config/config.module';
import { HandlerCommandModule } from './command/command.module';
import { HandlerEventModule } from './event/event.module';
import { async } from 'rxjs';
@Injectable()
export class HandlersService {
    constructor(
        private env: ConfigService
    ){}
    run() {
        const cacheStorage = new NodeCache({
            checkperiod: 10000,
            deleteOnExpire: true
        })
        const config = new ConfigModule(this.env, cacheStorage).config
        const handlerCommand: HandlerCommandModule = new HandlerCommandModule(config);
        handlerCommand.run()
        const client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.DirectMessages,
                Discord.GatewayIntentBits.MessageContent
            ]
        });
        const handlerEvent: HandlerEventModule = new HandlerEventModule(client, config);
        handlerEvent.run()
        // client.on(Discord.Events.InteractionCreate, async interaction =>{
        //     console.log(interaction);
        //     await interaction.reply("test")
        // })
        client.login(this.env.get("DISCORD_TOKEN"))
    }
} 