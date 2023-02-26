import { Module } from '@nestjs/common';
import { SlugParser } from './lib/slug';
import { ResponseParser } from './lib/response';
import { PaginationDto } from './dto/pagination.dto';
import { ObjectParser } from './lib/object';

@Module({
  providers: [SlugParser, ResponseParser, PaginationDto, ObjectParser],
  exports: [SlugParser, ResponseParser, PaginationDto, ObjectParser],
})
export class CommonModule {}
