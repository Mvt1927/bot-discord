import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HandlersService } from './handlers/handlers.service';
import { HandlersModule } from './handlers/handlers.module';

async function bootstrap() {
	const env: ConfigService = new ConfigService();
	await NestFactory.create(HandlersModule);
	const handlers: HandlersService = new HandlersService(env);
	handlers.run()
}
bootstrap();
