import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsUrl, IsAlphanumeric } from 'class-validator';

@Entity({ name: 'Comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn()
  dateCreated: Date;
  @Column('varchar', { length: 200 })
  @IsAlphanumeric()
  userName: string;
  @Column('varchar', { length: 200 })
  @IsEmail()
  email: string;

  @Column('varchar', { length: 200, nullable: true })
  @IsUrl()
  homePage?: string;

  @Column('varchar', { length: 1000, nullable: true })
  text?: string;

  @Column('varchar', { length: 200, nullable: true })
  attachImg?: string;
  @Column('varchar', { length: 200, nullable: true })
  attachTxt?: string;

  @ManyToOne(() => CommentEntity, { nullable: true })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: CommentEntity;

  @Column({ nullable: true })
  parentCommentId: string;

  @OneToMany(() => CommentEntity, (comment) => comment.parentComment, {
    onDelete: 'CASCADE',
  })
  childrenComments: CommentEntity[];
}
