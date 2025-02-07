import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize'; // Правильный импорт для fn

// Далее используем Sequelize.fn

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postModel: typeof Post) {}

  returnPosts(keyword?: string | null){
    const safeKeyword: string | null = keyword ? keyword.replace(' ', '&') : null;
    return safeKeyword ? this.postModel.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.match]: Sequelize.fn('to_tsquery', 'russian', `${safeKeyword}:*`),
            },
          },
          {
            author: {
              [Op.match]: Sequelize.fn('to_tsquery', 'russian', `${safeKeyword}:*`),
            },
          },
        ],
      },
    }): this.postModel.findAll();
  }

  makePost(data: CreationAttributes<Post>):Promise<Post>{
    return this.postModel.create(data);
  }
}
