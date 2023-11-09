import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dingding } from './entities/dindding.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FilterDingdingDto, SortDingdingDto } from './dto/query-dingding.dto';

@Injectable()
export class DingdingService {
  constructor(
    @InjectRepository(Dingding)
    private dingdingRepository: Repository<Dingding>,
  ) {}

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDingdingDto | null;
    sortOptions?: SortDingdingDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Dingding[]> {
    const where: FindOptionsWhere<Dingding> = {};
    if (filterOptions?.name?.length) {
      where.name = filterOptions.name;
    }

    return this.dingdingRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
  }
}
