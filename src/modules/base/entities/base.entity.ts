// src/modules/article/entity/article.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('base')
export class Base {
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

  // 姓名
  @Column('text')
  name: string;

  // 性别
  @Column('text')
  sex: string;

  // 出生年月
  @Column('text')
  birth: string;

  // 联系地址
  @Column('text')
  location: string;

  // 电话
  @Column()
  telephone: string;

  // 详细介绍
  @Column('text')
  introduce: string;

  // 毕业院校
  @Column('text')
  graduation: string;

  // 学历
  @Column('text')
  education: string;

  // 部门
  @Column('text')
  apartment: string;

  // 职称
  @Column('text')
  title: string;

  // 任职状态
  @Column('text')
  status: string;

  @Column('int', { default: 0 })
  is_admin?: number;

  // 加密后的密码
  @Column('text', { select: false })
  password: string;

  // 加密盐
  @Column('text', { select: false })
  salt: string;
}
