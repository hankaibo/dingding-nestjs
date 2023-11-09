import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
    if (limit > 50) {
      limit = 50;
    }

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
}
