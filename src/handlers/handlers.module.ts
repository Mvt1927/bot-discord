import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlersService } from './handlers.service';


@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true
      }),
    ],
    providers: [HandlersService]
  })
export class HandlersModule {} 