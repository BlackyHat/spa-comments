import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentSevice: CommentService) {}

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentSevice.createComment(createCommentDto);
  }
  @Get()
  async findAll() {
    return await this.commentSevice.getAllComments();
  }
  @Get('search')
  async findComments(@Req() request: Request) {
    return await this.commentSevice.findComments(request.query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentSevice.getOneComment(id);
  }
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentSevice.updateComment(id, updateCommentDto);
  }
  @Delete(':id')
  async removeComment(@Param('id') id: string) {
    const commentId = await this.commentSevice.removeComment(id);
    return { success: true, message: `Comment with ID:${commentId}, deleted` };
  }
}
