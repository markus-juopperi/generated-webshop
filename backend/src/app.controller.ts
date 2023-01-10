import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products/:id')
  getProduct(@Param() params): string {
    return this.appService.getProduct(params.id);
  }
}
