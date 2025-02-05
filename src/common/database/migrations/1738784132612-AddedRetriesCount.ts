import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRetriesCount1738784132612 implements MigrationInterface {
  name = 'AddedRetriesCount1738784132612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_logs" ADD "retryCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "email_logs" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."email_logs_status_enum" AS ENUM('created', 'pending', 'sent', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_logs" ADD "status" "public"."email_logs_status_enum" NOT NULL DEFAULT 'created'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_logs" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."email_logs_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "email_logs" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_logs" DROP COLUMN "retryCount"`,
    );
  }
}
