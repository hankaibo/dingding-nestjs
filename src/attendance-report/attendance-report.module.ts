import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceReport } from './entities/attendance-report.entity';
import { AttendanceReportController } from './attendance-report.controller';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { AttendanceReportService } from './attendance-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceReport])],
  controllers: [AttendanceReportController],
  providers: [IsExist, IsNotExist, AttendanceReportService],
  exports: [AttendanceReportService],
})
export class AttendanceReportModule {}
