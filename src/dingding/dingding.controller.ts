import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryDingdingDto } from './dto/query-dingding.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { Dingding } from './entities/dindding.entity';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { DingdingService } from './dingding.service';

@ApiTags('Dingding')
@Controller({
  path: 'dingding',
  version: '1',
})
export class DingdingController {
  constructor(private readonly dingdingService: DingdingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryDingdingDto,
  ): Promise<InfinityPaginationResultType<Dingding>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 1000) {
      limit = 1000;
    }

    query.filters = {
      name: '卜凯',
    };

    return infinityPagination(
      await this.dingdingService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.dingdingService.uploadFile(file);
  }
}
