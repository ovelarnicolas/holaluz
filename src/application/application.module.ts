import { Module } from '@nestjs/common';
import { FileService } from './service/FileService';
import { FileReader } from '../infraestructure/adapters/fileReader';
import DomainModule from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  providers: [
    {
      provide: 'IFileReader',
      useClass: FileReader,
    },
    {
      provide: FileService,
      useClass: FileService,
    },
  ],
  exports: [FileService],
})
export default class ApplicationModule {}
