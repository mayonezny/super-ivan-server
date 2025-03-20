import { UUID } from 'crypto';
import { Table, Column, Model, DataType, BeforeUpdate, AfterCreate } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    uuid: UUID;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
    name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

  @Column({ type: DataType.STRING, allowNull: false })
    password: string;

  @Column({ type: DataType.STRING })
    href: string;

  @Column({ type: DataType.STRING })
    pic: string;

  @Column({ type: DataType.STRING })
    picFilename: string;

  @Column({ type: DataType.STRING })
    group: string;

  @Column({ type: DataType.DATE })
    birthday: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW, allowNull: false })
    createdat: Date;

  @AfterCreate
  static async setHref(instance: User) {
    instance.href = `${instance.uuid}`;
    await instance.save();
  }
  @BeforeUpdate
  static protectFields(user: User) {
    if (user.changed('uuid')) {
      throw new Error('Дурашка! Зачем ты хочешь обновить uuid? А-та-та!');
    }
  }
}
