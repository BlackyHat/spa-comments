import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentSevice: CommentService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'attachImg', maxCount: 1 },
      {
        name: 'attachTxt',
        maxCount: 1,
      },
    ]),
  )
  async createComment(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles()
    files?: {
      attachImg?: Express.Multer.File;
      attachTxt?: Express.Multer.File;
    },
  ) {
    const { host } = req.headers;
    const protocol = req.secure ? 'https' : 'http';
    return await this.commentSevice.createComment(
      createCommentDto,
      files,
      protocol,
      host,
    );
  }

  @Get()
  async findAll() {
    return await this.commentSevice.getAllComments();
  }
  @Get('search')
  async findComments(@Req() req: Request) {
    return await this.commentSevice.findComments(req.query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentSevice.getOneComment(id);
  }
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'attachImg', maxCount: 1 },
      {
        name: 'attachTxt',
        maxCount: 1,
      },
    ]),
  )
  async updateComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFiles()
    files?: {
      attachImg?: Express.Multer.File;
      attachTxt?: Express.Multer.File;
    },
  ) {
    const { host } = req.headers;
    const protocol = req.secure ? 'https' : 'http';

    return await this.commentSevice.updateComment(
      id,
      updateCommentDto,
      files,
      protocol,
      host,
    );
  }
  @Delete(':id')
  async removeComment(@Param('id') id: string) {
    const commentId = await this.commentSevice.removeComment(id);
    return { success: true, message: `Comment with ID:${commentId}, deleted` };
  }
}
