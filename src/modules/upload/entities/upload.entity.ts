import { Research } from "src/modules/research/entities/research.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('upload')
export class Upload {
  // 主键id
  @PrimaryGeneratedColumn()
  fileId: number;

  @Column()
  type: number;

  // 创建时间
  @CreateDateColumn()
  createTime: Date

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date

  // 文件名
  @Column('text')
  fileName: string;

  @Column('text')
  fileType: string;

  // 文件大小
  @Column()
  fileSize: number;

  // 文件路径
  @Column('text')
  fileUrl: string;

  // 文件格式
  @Column('text')
  encoding: string;

  // 普通的列（非外键）
  @Column()
  foreignId: number;

  // // @JoinColumn()
  // @ManyToOne(() => Research, (m) => m.files)
  // research: Research;
}