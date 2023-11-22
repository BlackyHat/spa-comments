import { IsUrl, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsUrl()
  homePage?: string;

  @IsNotEmpty()
  text?: string;

  @IsOptional()
  parentCommentId?: string;
}
