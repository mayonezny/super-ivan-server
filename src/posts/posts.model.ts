import { Table, Column, Model, DataType, AfterCreate } from 'sequelize-typescript';

@Table({ tableName: 'posts', timestamps: false })
export class Post extends Model<Post> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

  @Column({ type: DataType.STRING })
    href: string;

  @Column({ type: DataType.STRING, allowNull: false })
    pic: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
    title: string;

  @Column({ type: DataType.STRING, allowNull: false })
    author: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW, allowNull: false })
    date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
    content: string;

  @AfterCreate
  static async setHref(instance: Post) {
    console.log(instance.author);
    instance.href = `${instance.author}/${instance.id}`;
    await instance.save();
  }
}
