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

  handleGetPosts(){
    const posts = [
      { id: 1, href: 'ivan/1', pic: '/babka.png', title: 'AUE', author: 'Zapara' },
      { id: 2, href: 'ivan/2', pic: '/babka.png',  title: 'basota', author: 'Nw' },
      { id: 3, href: 'ivan/3', pic: '/babka.png',  title: 'NIERS', author: 'banger' },
    ];
    return posts;
  }
}
