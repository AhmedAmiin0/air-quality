import { Module } from '@nestjs/common';
import { IqairClient } from './iqair.client';
import { ConfigModule } from '@nestjs/config';
import iqairConfig from './iqair.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [IqairClient],
  imports: [
    ConfigModule.forFeature(iqairConfig),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  exports: [IqairClient],
})
export class IqairModule { }
