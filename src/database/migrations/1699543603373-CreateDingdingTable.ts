import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDingdingTable1699543603373 implements MigrationInterface {
  name = 'CreateDingdingTable1699543603373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dingding" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "workDate" date NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "rest" integer NOT NULL, CONSTRAINT "PK_be2b3a9de1bdff9cf5fd4ab07ac" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dingding"`);
  }
}
