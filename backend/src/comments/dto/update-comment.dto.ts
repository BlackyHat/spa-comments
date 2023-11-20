import { IsUrl, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsUrl()
  homePage?: string;

  @IsOptional()
  parentCommentId?: string;
  text?: string;
  attachImg?: string;
  attachTxt?: string;
}
