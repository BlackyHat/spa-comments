import {
  IsEmail,
  IsUrl,
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCommentDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  text: string;

  @IsOptional()
  parentCommentId?: string;
  attachImg?: string;
  attachTxt?: string;

  @IsOptional()
  @IsUrl()
  homePage?: string;
}
