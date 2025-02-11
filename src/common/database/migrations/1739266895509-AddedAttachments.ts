import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedAttachments1739266895509 implements MigrationInterface {
  name = 'AddedAttachments1739266895509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_logs" ADD "attachments" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_logs" DROP COLUMN "attachments"`,
    );
  }
}
