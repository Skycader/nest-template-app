import { MigrationInterface, QueryRunner } from "typeorm";

export class Mymigrations1692745320564 implements MigrationInterface {
    name = 'Mymigrations1692745320564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "role" varchar NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "midname" varchar NOT NULL, "birthdate" integer NOT NULL, "telephone" varchar NOT NULL, "linkToCase" varchar NOT NULL DEFAULT (''), "information" varchar NOT NULL, "informationForModerator" varchar NOT NULL, "password" varchar NOT NULL, "salt" varchar NOT NULL, "informationReadonly" varchar NOT NULL DEFAULT (''), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "role", "name", "surname", "midname", "birthdate", "telephone", "linkToCase", "information", "informationForModerator", "password", "salt") SELECT "id", "username", "role", "name", "surname", "midname", "birthdate", "telephone", "linkToCase", "information", "informationForModerator", "password", "salt" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "role" varchar NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "midname" varchar NOT NULL, "birthdate" integer NOT NULL, "telephone" varchar NOT NULL, "linkToCase" varchar NOT NULL DEFAULT (''), "information" varchar NOT NULL, "informationForModerator" varchar NOT NULL, "password" varchar NOT NULL, "salt" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "role", "name", "surname", "midname", "birthdate", "telephone", "linkToCase", "information", "informationForModerator", "password", "salt") SELECT "id", "username", "role", "name", "surname", "midname", "birthdate", "telephone", "linkToCase", "information", "informationForModerator", "password", "salt" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
