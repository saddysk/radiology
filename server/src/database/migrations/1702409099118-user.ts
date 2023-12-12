import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1702409099118 implements MigrationInterface {
  name = 'User1702409099118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_commission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "doctorId" uuid NOT NULL, "centreId" uuid NOT NULL, "modality" character varying NOT NULL, "amount" integer NOT NULL DEFAULT '0', "startDate" TIMESTAMP NOT NULL DEFAULT '"1970-01-01T00:00:00.000Z"', "endDate" TIMESTAMP NOT NULL DEFAULT '"2030-12-31T00:00:00.000Z"', "letGo" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_87508dfa1c92f63bb65c3c4381e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'receptionist', 'pr', 'doctor')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "isFirstLogin" boolean NOT NULL DEFAULT true, "centreId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "centre_admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "userId" uuid NOT NULL, "centreId" uuid NOT NULL, CONSTRAINT "PK_c7317e50fba131813c3ba5285f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "centre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreNumber" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" json NOT NULL, CONSTRAINT "UQ_3b05eddde62bcc5ec96918705b7" UNIQUE ("centreNumber"), CONSTRAINT "PK_935b270f171eab8dc96443baeb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "centre_pr" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "userId" uuid NOT NULL, "centreId" uuid NOT NULL, CONSTRAINT "PK_09f3683fa01570cb08673518e4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "hash" character varying NOT NULL, "userId" uuid NOT NULL, "lastUsedAt" TIMESTAMP, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreId" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "expenseType" character varying NOT NULL, "name" character varying NOT NULL, "paymentMethod" character varying NOT NULL, "remark" character varying, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "bookingId" uuid NOT NULL, "amount" integer NOT NULL, "discount" integer, "extraCharge" character varying, "paymentType" character varying NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreId" uuid NOT NULL, "patientId" uuid NOT NULL, "smkId" character varying, "submittedBy" uuid NOT NULL, "consultant" uuid NOT NULL, "modality" character varying NOT NULL, "investigation" character varying NOT NULL, "remark" character varying, "records" json DEFAULT '[]', "referralAmount" integer DEFAULT '0', "totalAmount" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreId" uuid NOT NULL, "patientNumber" character varying, "name" character varying NOT NULL, "age" integer NOT NULL, "gender" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying, "address" character varying, "abhaId" character varying, CONSTRAINT "UQ_1b69bd8c54da35d96a56bbccb78" UNIQUE ("patientNumber"), CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rate_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreId" uuid NOT NULL, "modality" character varying NOT NULL, "investigation" json NOT NULL, CONSTRAINT "PK_2bbf5b3694066da432c9e0f0187" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."update_request_type_enum" AS ENUM('expense', 'booking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."update_request_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "update_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" uuid, "centreId" uuid NOT NULL, "type" "public"."update_request_type_enum" NOT NULL, "requestedBy" uuid NOT NULL, "status" "public"."update_request_status_enum" NOT NULL DEFAULT 'pending', "requestData" json, "pastData" json, CONSTRAINT "PK_ee52e3bb1d57e4176a1dc5a9270" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_commission" ADD CONSTRAINT "FK_09f79891ed4e0825289c987bee8" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_commission" ADD CONSTRAINT "FK_3b14d2ccc613bf398603a7bc3c2" FOREIGN KEY ("centreId") REFERENCES "centre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_admin" ADD CONSTRAINT "FK_30b814b3f43e000dd5869046567" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_admin" ADD CONSTRAINT "FK_308ea08ed36a0554d0e46e29371" FOREIGN KEY ("centreId") REFERENCES "centre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_pr" ADD CONSTRAINT "FK_857c6e75cdb9c8ea6bd8c261b06" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_pr" ADD CONSTRAINT "FK_ee879a9ab8de0fdb1d908b6e2a0" FOREIGN KEY ("centreId") REFERENCES "centre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "FK_5a326267f11b44c0d62526bc718" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_de2b4572c0e9f7ad3793817a2b3" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_de2b4572c0e9f7ad3793817a2b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" DROP CONSTRAINT "FK_5a326267f11b44c0d62526bc718"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_pr" DROP CONSTRAINT "FK_ee879a9ab8de0fdb1d908b6e2a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_pr" DROP CONSTRAINT "FK_857c6e75cdb9c8ea6bd8c261b06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_admin" DROP CONSTRAINT "FK_308ea08ed36a0554d0e46e29371"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centre_admin" DROP CONSTRAINT "FK_30b814b3f43e000dd5869046567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_commission" DROP CONSTRAINT "FK_3b14d2ccc613bf398603a7bc3c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_commission" DROP CONSTRAINT "FK_09f79891ed4e0825289c987bee8"`,
    );
    await queryRunner.query(`DROP TABLE "update_request"`);
    await queryRunner.query(`DROP TYPE "public"."update_request_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."update_request_type_enum"`);
    await queryRunner.query(`DROP TABLE "rate_list"`);
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "expense"`);
    await queryRunner.query(`DROP TABLE "auth_token"`);
    await queryRunner.query(`DROP TABLE "centre_pr"`);
    await queryRunner.query(`DROP TABLE "centre"`);
    await queryRunner.query(`DROP TABLE "centre_admin"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "doctor_commission"`);
  }
}
