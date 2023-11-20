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
      return await this.commentRepository.save(createCommentDTO);
    }
    const newComment = parentCommentId
      ? {
          parentComment: { id: parentCommentId },
          ...commentData,
        }
      : commentData;
    return await this.commentRepository.save(newComment);
  }
  async getAllComments() {
    return await this.commentRepository.find({
      where: {
        parentCommentId: null,
      },
      order: { dateCreated: 'ASC' },
      relations: { childrenComments: true },
    });
  }
  async getAllUserComments(email: string) {
    return await this.commentRepository.find({
      where: {
        email,
      },
      order: { dateCreated: 'ASC' },
      // relations: { parentComment: true, childrenComments: true },
    });
  }
  async getOneComment(id: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
      relations: { parentComment: true, childrenComments: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
  async updateComment(id: string, updateCommentDTO: UpdateCommentDto) {
    const comment = await this.getOneComment(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    Object.assign(comment, updateCommentDTO);
    return await this.commentRepository.save(comment);
  }
  async removeComment(id: string) {
    const comment = await this.getOneComment(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentRepository.remove(comment);
    return id;
  }
}
