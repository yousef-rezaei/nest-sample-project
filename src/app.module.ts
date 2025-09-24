import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import Users from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';

import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';

// lpad data from .env file
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../', 'static'),
    }),
    // ⬇️ add this for uploaded files
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/auth*', '/products*', '/users*', '/docs*', '/health'],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    // ⬇️ HERE: Mailer configuration with debug logs
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.get('SMTP_HOST'),
          port: Number(cfg.get('SMTP_PORT')),
          secure: cfg.get('SMTP_SECURE') === 'true',
          auth: { user: cfg.get('SMTP_USER'), pass: cfg.get('SMTP_PASS') },

          // Debugging for SMTP handshake + send result
          logger: true,
          debug: true,
          // tls: { rejectUnauthorized: false }, // enable only if you see TLS trust errors
        },
        defaults: { from: cfg.get('MAIL_FROM') },
        template: {
          dir: path.join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new EjsAdapter(),
          options: { strict: false },
        },
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        new QueryResolver(['lang']),
        new AcceptLanguageResolver(),
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'nestjs_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users]),
    UsersModule,
    ProductsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
