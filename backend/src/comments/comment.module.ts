import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentEntity } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './controllers/comment.controllers';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentsModule {}
