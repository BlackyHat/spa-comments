import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(createCommentDTO: CreateCommentDto) {
    const { parentCommentId, ...commentData } = createCommentDTO;

    if (!parentCommentId) {
      const newComment = this.commentRepository.create({
        ...commentData,
      });
      return await this.commentRepository.save(newComment);
    }

    const parentComment = await this.commentRepository.findOne({
      where: {
        id: parentCommentId,
      },
    });

    if (!parentComment) {
      return null;
    }

    const newComment = this.commentRepository.create({
      ...commentData,
      parent: parentComment,
    });

    return await this.commentRepository.save(newComment);
  }
  async getAllComments() {
    return await this.commentRepository.manager
      .getTreeRepository(CommentEntity)
      .findTrees();
  }
  async findComments(searchParams: Partial<CommentEntity>) {
    return await this.commentRepository.manager
      .getTreeRepository(CommentEntity)
      .find({ where: { ...searchParams } });
  }
  async getOneComment(id: string) {
    const comment = await this.commentRepository.manager
      .getTreeRepository(CommentEntity)
      .find({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async updateComment(id: string, updateCommentDTO: UpdateCommentDto) {
    const comment = await this.getOneComment(id);
    Object.assign(comment, updateCommentDTO);
    return await this.commentRepository.save(comment);
  }

  async removeComment(id: string) {
    const comment = await this.getOneComment(id);
    await this.commentRepository.remove(comment);
    return id;
  }
}
