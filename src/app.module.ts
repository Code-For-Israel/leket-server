import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaModule} from './prisma/prisma.module';
import {FieldsModule} from './fields/fields.module';
import {SatellitesModule} from './satellites/satellites.module';
import {AttractivenessModule} from './attractivenesses/attractiveness.module';
import {MarketsModule} from './markets/markets.module';
import {MissionsModule} from './missions/missions.module';
import {HistoriesModule} from './histories/histories.module';
import {AuthModule} from './auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtMiddleware} from './jwt.middleware';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },
            }),
        }),
        ConfigModule.forRoot(),
        PrismaModule,
        FieldsModule,
        SatellitesModule,
        AttractivenessModule,
        MarketsModule,
        MissionsModule,
        HistoriesModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
// export class AppModule {}
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .exclude('/auth/login', '/auth/pulse', '/') // Exclude 'auth/login' route from authentication
            .forRoutes('*');
    }
}
