import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDingdingTable1700976377352 implements MigrationInterface {
  name = 'CreateDingdingTable1700976377352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dingding" DROP COLUMN "rest"`);
    await queryRunner.query(
      `ALTER TABLE "dingding" ADD "rest" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dingding" DROP COLUMN "rest"`);
    await queryRunner.query(
      `ALTER TABLE "dingding" ADD "rest" integer NOT NULL`,
    );
  }
}
