import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { read, utils } from 'xlsx';
import { AttendanceReport } from './entities/attendance-report.entity';
import { Repository, FindOptionsWhere, MoreThanOrEqual } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FilterAttendanceReportDto,
  SortAttendanceReportDto,
} from './dto/query-attendance-report.dto';

type ItemType = {
  name: string;
  __EMPTY_6: string;
  __EMPTY_8: string;
  __EMPTY_10: string;
  __EMPTY_38: number;
};

@Injectable()
export class AttendanceReportService {
  constructor(
    @InjectRepository(AttendanceReport)
    private attendanceReportRepository: Repository<AttendanceReport>,
  ) {}

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterAttendanceReportDto | null;
    sortOptions?: SortAttendanceReportDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<AttendanceReport[]> {
    const where: FindOptionsWhere<AttendanceReport> = {};
    if (filterOptions?.name?.length) {
      where.name = filterOptions.name;
    }
    if (filterOptions?.date) {
      where.workDate = MoreThanOrEqual(filterOptions.date);
    }

    return this.attendanceReportRepository.find({
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

      const workDate = new Date(+item.__EMPTY_6);

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
    await this.attendanceReportRepository
      .createQueryBuilder()
      .insert()
      .into(AttendanceReport)
      .values(users)
      .execute();
  }
}
