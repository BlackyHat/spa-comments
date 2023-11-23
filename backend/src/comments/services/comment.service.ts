import * as path from 'path';
import * as fs from 'fs/promises';
import * as sharp from 'sharp';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CommentEntity } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly configService: ConfigService,
  ) {}

  async createComment(
    createCommentDTO: CreateCommentDto,
    files: { [x: string]: Express.Multer.File },
    protocol: string,
    host: string,
  ) {
    const { parentCommentId, ...commentData } = createCommentDTO;
    if (files.attachImg) {
      const path = await this.saveImage(files.attachImg[0]);
      commentData.attachImg = [protocol + ':/', host, path].join('/');
    }
    if (files.attachTxt) {
      const path = await this.saveTxtFile(files.attachTxt[0]);
      commentData.attachTxt = [protocol + ':/', host, path].join('/');
    }

    if (!parentCommentId) {
      const newComment = this.commentRepository.create(commentData);
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
    const [comment] = await this.commentRepository.manager
      .getTreeRepository(CommentEntity)
      .find({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDTO: UpdateCommentDto,
    files: { [x: string]: Express.Multer.File },
    protocol: string,
    host: string,
  ) {
    const comment = await this.getOneComment(id);
    if (files.attachImg) {
      const path = await this.saveImage(files.attachImg[0]);
      comment.attachImg = [protocol + ':/', host, path].join('/');
    }
    if (files.attachTxt) {
      const path = await this.saveTxtFile(files.attachTxt[0]);
      comment.attachTxt = [protocol + ':/', host, path].join('/');
    }

    Object.assign(comment, updateCommentDTO);
    return await this.commentRepository.save(comment);
  }

  async removeComment(id: string) {
    const comment = await this.getOneComment(id);
    await this.commentRepository.remove(comment);
    return id;
  }
  async saveImage(image: Express.Multer.File) {
    const IMG_FOLDER = 'images';

    if (!image.mimetype.match(/^image\/(jpeg|jpg|gif|png)$/i)) {
      throw new BadRequestException('Image type not supported');
    }
    const filename = String(Date.now()).concat('-', image.originalname);

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const imagePath = path.join(uploadPath, IMG_FOLDER, filename);

    try {
      await sharp(image.buffer).resize(320, 240).toFile(imagePath);
      return [uploadPath, IMG_FOLDER, filename].join('/');
    } catch (error) {
      throw new InternalServerErrorException('Failed to process the image');
    }
  }
  async saveTxtFile(txtFile: Express.Multer.File) {
    const TXT_FILE_SIZE = 100 * 1024;
    const TXT_FOLDER = 'text';
    if (txtFile.size > TXT_FILE_SIZE) {
      throw new BadRequestException('Text file size more than 100kb');
    }
    if (txtFile.mimetype !== 'text/plain') {
      throw new BadRequestException('Text file type not supported');
    }
    const filename = String(Date.now()).concat('-', txtFile.originalname);

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const txtPath = path.join(uploadPath, TXT_FOLDER, filename);

    try {
      await fs.writeFile(txtPath, txtFile.buffer);
      return [uploadPath, TXT_FOLDER, filename].join('/');
    } catch (error) {
      throw new InternalServerErrorException('Failed to save the file');
    }
  }
}
