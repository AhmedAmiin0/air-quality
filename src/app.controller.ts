import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './test.dto';
import { IqairClient } from './shared/iqair/iqair.client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


}
