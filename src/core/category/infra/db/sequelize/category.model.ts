import { Column, DataType, Model, Table } from 'sequelize-typescript';

export type CategoryModelAttributes = {
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

@Table({
  tableName: 'categories',
  timestamps: false,
  underscored: true,
  createdAt: 'created_at',
})
export class CategoryModel extends Model<CategoryModelAttributes> {
  @Column({  type: DataType.UUID,
    defaultValue: DataType.UUIDV4, primaryKey: true })
  declare categoryId: string;
  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;
  @Column({ type: DataType.STRING(255) })
  declare description: string | null;
  @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare createdAt: Date;
}
