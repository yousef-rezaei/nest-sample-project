import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import passport from 'passport';
import session from 'express-session';

// ⬇️ i18n needs this to read the "lang" cookie
import cookieParser = require('cookie-parser');

import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⬇️ enable cookies for i18n CookieResolver (lang)
  app.use(cookieParser());

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: 'secret',
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
