-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('system_user', 'user');

-- CreateEnum
CREATE TYPE "SalaryPaymentPeriode" AS ENUM ('daily', 'weekly', 'bi_weekly', 'semi_monthly', 'monthly');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "image" TEXT,
    "role" "UserRoles" NOT NULL,
    "google_account_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_time_token_secrets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "time_used" INTEGER NOT NULL DEFAULT 0,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "one_time_token_secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_position_name" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_position_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_positions" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "work_position_name_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_names" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "bank_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT,
    "bank_account_number" TEXT,
    "bank_account_name" TEXT,
    "bank_name_id" TEXT,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salary_daily" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salary_payment_periode" "SalaryPaymentPeriode",
    "allowance_meal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allowance_holiday" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtime_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtime_holiday_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "clock_out_time" TIME NOT NULL,
    "workingTime" TEXT NOT NULL DEFAULT '0+0',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_times" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "attendance_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_times_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_google_account_id_idx" ON "users"("google_account_id");

-- CreateIndex
CREATE INDEX "one_time_token_secrets_user_id_idx" ON "one_time_token_secrets"("user_id");

-- CreateIndex
CREATE INDEX "work_positions_employee_id_idx" ON "work_positions"("employee_id");

-- CreateIndex
CREATE INDEX "work_positions_work_position_name_id_idx" ON "work_positions"("work_position_name_id");

-- CreateIndex
CREATE INDEX "employees_bank_name_id_idx" ON "employees"("bank_name_id");

-- CreateIndex
CREATE INDEX "attendance_employee_id_idx" ON "attendance"("employee_id");

-- CreateIndex
CREATE INDEX "attendance_times_employee_id_idx" ON "attendance_times"("employee_id");

-- CreateIndex
CREATE INDEX "attendance_times_attendance_id_idx" ON "attendance_times"("attendance_id");

-- AddForeignKey
ALTER TABLE "one_time_token_secrets" ADD CONSTRAINT "one_time_token_secrets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_positions" ADD CONSTRAINT "work_positions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_positions" ADD CONSTRAINT "work_positions_work_position_name_id_fkey" FOREIGN KEY ("work_position_name_id") REFERENCES "work_position_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_bank_name_id_fkey" FOREIGN KEY ("bank_name_id") REFERENCES "bank_names"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_times" ADD CONSTRAINT "attendance_times_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_times" ADD CONSTRAINT "attendance_times_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
