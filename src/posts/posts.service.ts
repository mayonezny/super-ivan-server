import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postModel: typeof Post) {}

  returnPosts(){
    return this.postModel.findAll();
  }

  makePost(data: CreationAttributes<Post>):Promise<Post>{
    return this.postModel.create(data);
  }
}
