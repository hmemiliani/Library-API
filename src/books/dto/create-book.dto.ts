import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book' })
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty({ description: 'The author of the book' })
  @IsString()
  @IsNotEmpty()
  author: string;


  @ApiProperty({ description: 'The publication date of the book' })
  @IsDateString()
  @IsNotEmpty()
  publicationDate: string;


  @ApiProperty({ description: 'The genre of the book' })
  @IsString()
  @IsNotEmpty()
  genre: string;
}
