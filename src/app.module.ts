import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DomainModule from './domain/domain.module';
import ApplicationModule from './application/application.module';
import InfrastructureModule from './infraestructure/infraestructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
  ],
})
export class AppModule {}
