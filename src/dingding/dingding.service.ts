import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { read, utils } from 'xlsx';
import { Dingding } from './entities/dindding.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FilterDingdingDto, SortDingdingDto } from './dto/query-dingding.dto';

type ItemType = {
  name: string;
  __EMPTY_6: string;
  __EMPTY_8: string;
  __EMPTY_10: string;
  __EMPTY_38: number;
};

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

  async uploadFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // file.buffer is a Buffer
    const wb = read(file.buffer);
    const datas = utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]]);

    const users: any[] = [];
    for (let i = 3; i < datas.length; i += 1) {
      // 为 item 指定类型

      const item = datas[i] as ItemType;

      let name = '';
      const key = Object.keys(item).filter((it) => !it.startsWith('__EMPTY'));
      if (key.length) {
        name = item[key[0]];
      }

      const workDate = new Date(+item.__EMPTY_6).toLocaleDateString();

      const startTime = item.__EMPTY_8;
      if (startTime === '') {
      }

      const endTime = item.__EMPTY_10;
      if (endTime === '') {
      }

      const rest = item.__EMPTY_38 || 0;

      users.push({
        name,
        workDate,
        startTime,
        endTime,
        rest,
      });
    }

    // 批量插入
    await this.dingdingRepository
      .createQueryBuilder()
      .insert()
      .into(Dingding)
      .values(users)
      .execute();
  }
}
