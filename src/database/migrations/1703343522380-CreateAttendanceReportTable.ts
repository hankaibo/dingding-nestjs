import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttendanceReportTable1703343522380
  implements MigrationInterface
{
  name = 'CreateAttendanceReportTable1703343522380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attendance_report" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "workDate" TIMESTAMP WITH TIME ZONE NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "rest" numeric(10,2) NOT NULL, CONSTRAINT "PK_9d68e6d50509c56723547544934" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "attendance_report"`);
  }
}
