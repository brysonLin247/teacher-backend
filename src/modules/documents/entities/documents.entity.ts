import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('documents')
export class Documents {
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 创建时间
  @CreateDateColumn()
  createTime: Date

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date

  // 软删除
  @Column({
    default: false
  })
  isDelete: boolean

  // 公文标题
  @Column()
  title: string;

  // 公文类别
  @Column()
  type: number;

  //公文内容
  @Column('longtext')
  content: string;

  // 作者
  @Column()
  author: string;

  // 封面图片
  @Column()
  picUrl: string;
}
