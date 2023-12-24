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
import { QueryAttendanceReportDto } from './dto/query-attendance-report.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { AttendanceReport } from './entities/attendance-report.entity';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { AttendanceReportService } from './attendance-report.service';
import { TransformInterceptor } from './transform.interceptor';

@ApiTags('AttendanceReport')
@Controller({
  path: 'attendance-report',
  version: '1',
})
export class AttendanceReportController {
  constructor(
    private readonly attendanceReportService: AttendanceReportService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async findAll(
    @Query() query: QueryAttendanceReportDto,
  ): Promise<InfinityPaginationResultType<AttendanceReport>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 1000) {
      limit = 1000;
    }

    return infinityPagination(
      await this.attendanceReportService.findManyWithPagination({
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
    return this.attendanceReportService.uploadFile(file);
  }
}
