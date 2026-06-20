import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import dbConfig from './configs/db.config'
import commonConfig from './configs/common.config'
import { databaseConfigFactory } from './database/database.config'
import { AuthGuard } from './guards/auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './guards/roles.guard'
import { AttemptsModule } from './modules/attempts/attempts.module'
import { AnswersModule } from './modules/answers/answers.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, commonConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfigFactory,
    }),
    AttemptsModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
