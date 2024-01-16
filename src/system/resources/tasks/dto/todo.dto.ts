import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDate,
  IsString,
  IsBoolean,
  IsInt,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Types } from 'mongoose';

class SubTask {
  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  emoji: string;
}

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  location: string;

  @IsString()
  emoji: string;

  @IsBoolean()
  setReminder: boolean;

  @IsDateString()
  due_date: string;

  @IsInt()
  priority: number;

  @IsMongoId()
  category: string; 

  @ApiProperty({ description: 'sub-task', required: false })
  @IsOptional()
  // @IsArray()
  // @ArrayMinSize(1)
  readonly subTask?: SubTask[];

  media?: string[];

  cloudId?: string[];
}
