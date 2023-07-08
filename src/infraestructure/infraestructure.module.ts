import { Module } from '@nestjs/common';
import ApplicationModule from '../application/application.module';

// TODO: Implement any DB logic in this Module
@Module({
  imports: [ApplicationModule],
})
export default class InfrastructureModule {}
