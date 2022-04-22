import { Base } from 'src/modules/base/entities/base.entity';
import { Upload } from 'src/modules/upload/entities/upload.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('research')
export class Research {
  // 科研编号
  @PrimaryGeneratedColumn()
  researchId: number;

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

  // 科研名称
  @Column('text')
  researchName: string;

  // 科研领域
  @Column()
  field: number;

  // 项目类别
  @Column()
  category: number;

  // 是否审核
  @Column({
    default: 0
  })
  review: number;

  // 申请额度
  @Column()
  cost: number;

  // 审核人
  @Column('text')
  reviewer: string;

  // 描述
  @Column('text')
  description: string;

  @JoinColumn()
  @ManyToOne(() => Base, (base) => base.researches)
  base: Base;

  @Column()
  baseId: number;

  tearcherName: string;

  // @JoinColumn()
  // @OneToMany(() => Upload, (m) => m.research, { cascade: true })
  // files: Upload[]

  files:Upload[];
}
