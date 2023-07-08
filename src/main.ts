import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileService } from './application/service/FileService';

async function bootstrap() {
  const fileName = process.argv[2] || process.env.FILE_NAME;
  const app = await NestFactory.create(AppModule);

  const service = app.get(FileService);
  const report = await service.readFile(fileName);
  console.table(report);
}
bootstrap();
