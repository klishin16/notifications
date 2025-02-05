import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEmailLog1738780705253 implements MigrationInterface {
    name = 'AddedEmailLog1738780705253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "to" character varying NOT NULL, "subject" character varying NOT NULL, "text" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "errorMessage" character varying, CONSTRAINT "PK_999382218924e953a790d340571" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_logs"`);
    }

}
