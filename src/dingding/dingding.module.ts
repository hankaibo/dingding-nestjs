import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dingding } from './entities/dindding.entity';
import { DingdingController } from './dingding.controller';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { DingdingService } from './dingding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dingding])],
  controllers: [DingdingController],
  providers: [IsExist, IsNotExist, DingdingService],
  exports: [DingdingService],
})
export class DingdingModule {}
