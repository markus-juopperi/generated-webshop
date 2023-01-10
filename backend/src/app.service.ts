import { Injectable } from '@nestjs/common';
import fs = require('fs');
import { join } from 'path';

@Injectable()
export class AppService {
  getProduct(id: string): string {
    const json = fs.readFileSync(join(process.cwd(), 'resources/json/' + id + '.json')).toString();
    return json;
  }
}
