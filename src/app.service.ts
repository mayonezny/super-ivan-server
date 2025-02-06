import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return { message: 'Zdarova Schegol' };
  }
  handlePost(body: any): any {
    return body;
  }
  handleSosat() { }
}
