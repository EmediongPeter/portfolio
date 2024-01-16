import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/category.dto';
import { AuthGuard } from 'src/helpers/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  addCategory(@Req() req, @Body() data: CreateCategoryDto) {
    return this.categoryService.addCategory(data, req.user.id);
  }
}
