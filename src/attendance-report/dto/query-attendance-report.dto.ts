import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class FilterAttendanceReportDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  date: Date;
}

export class SortAttendanceReportDto {
  @ApiProperty()
  @IsString()
  orderBy: string;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryAttendanceReportDto {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(FilterAttendanceReportDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterAttendanceReportDto)
  filters?: FilterAttendanceReportDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(SortAttendanceReportDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortAttendanceReportDto)
  sort?: SortAttendanceReportDto[] | null;
}
