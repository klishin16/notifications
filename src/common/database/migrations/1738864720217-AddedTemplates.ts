import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTemplates1738864720217 implements MigrationInterface {
  name = 'AddedTemplates1738864720217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_logs" ADD "template" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_logs" ADD "templateData" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_logs" DROP COLUMN "templateData"`,
    );
    await queryRunner.query(`ALTER TABLE "email_logs" DROP COLUMN "template"`);
  }
}
