/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
import { UUID } from 'crypto';
import { Table, Column, Model, DataType, BeforeUpdate, AfterCreate } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, allowNull: false, validate: { isUUID: 4 } })
    uuid: UUID;

  @Column({ type: DataType.STRING(40), allowNull: false, unique: true, validate: { isEmail: true } })
    email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
    password: string;

  @Column({ type: DataType.STRING, unique: true })
    name: string;

  @Column({ type: DataType.STRING })
    href: string;

  @Column({ type: DataType.STRING })
    pic: string;

  @Column({ type: DataType.STRING })
    picFilename: string;

  @Column({ type: DataType.STRING(10) })
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
