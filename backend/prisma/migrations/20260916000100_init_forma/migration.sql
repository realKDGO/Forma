-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "forma";

-- CreateEnum
CREATE TYPE "forma"."GoalType" AS ENUM ('LOSE', 'MAINTAIN', 'GAIN');

-- CreateEnum
CREATE TYPE "forma"."ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'VERY', 'EXTREME');

-- CreateEnum
CREATE TYPE "forma"."FoodSource" AS ENUM ('FORMA', 'USER', 'OPEN_FOOD_FACTS');

-- CreateEnum
CREATE TYPE "forma"."MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');

-- CreateEnum
CREATE TYPE "forma"."WorkoutStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "forma"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" DATE,
    "sex" TEXT,
    "height_cm" DECIMAL(6,2),
    "units" TEXT NOT NULL DEFAULT 'metric',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."goals" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "goal_type" "forma"."GoalType" NOT NULL,
    "target_weight_kg" DECIMAL(6,2),
    "activity_level" "forma"."ActivityLevel" NOT NULL,
    "weekly_rate_kg" DECIMAL(4,2),
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "carbohydrates" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "fiber" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."foods" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "external_id" TEXT,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "serving_amount" DECIMAL(10,3) NOT NULL,
    "serving_unit" TEXT NOT NULL,
    "calories" DECIMAL(10,3) NOT NULL,
    "protein" DECIMAL(10,3) NOT NULL,
    "carbohydrates" DECIMAL(10,3) NOT NULL,
    "fat" DECIMAL(10,3) NOT NULL,
    "fiber" DECIMAL(10,3) NOT NULL,
    "source" "forma"."FoodSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."food_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "food_id" UUID,
    "date" DATE NOT NULL,
    "meal" "forma"."MealType" NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "nutrition" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."favorite_foods" (
    "user_id" UUID NOT NULL,
    "food_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_foods_pkey" PRIMARY KEY ("user_id","food_id")
);

-- CreateTable
CREATE TABLE "forma"."weight_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "weight_kg" DECIMAL(6,2) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."routines" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "exercises" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."workouts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "routine_id" UUID,
    "name" TEXT NOT NULL,
    "status" "forma"."WorkoutStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "notes" TEXT,
    "exercises" JSONB NOT NULL,
    "summary" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma"."mutation_receipts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "operation" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mutation_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "forma"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "forma"."profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "goals_user_id_key" ON "forma"."goals"("user_id");

-- CreateIndex
CREATE INDEX "foods_owner_id_name_idx" ON "forma"."foods"("owner_id", "name");

-- CreateIndex
CREATE INDEX "foods_barcode_idx" ON "forma"."foods"("barcode");

-- CreateIndex
CREATE INDEX "food_logs_user_id_date_idx" ON "forma"."food_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "weight_logs_user_id_date_idx" ON "forma"."weight_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "routines_user_id_updated_at_idx" ON "forma"."routines"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "workouts_user_id_status_started_at_idx" ON "forma"."workouts"("user_id", "status", "started_at");

-- CreateIndex
CREATE INDEX "mutation_receipts_user_id_created_at_idx" ON "forma"."mutation_receipts"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "forma"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."foods" ADD CONSTRAINT "foods_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."food_logs" ADD CONSTRAINT "food_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."food_logs" ADD CONSTRAINT "food_logs_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "forma"."foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."favorite_foods" ADD CONSTRAINT "favorite_foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."favorite_foods" ADD CONSTRAINT "favorite_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "forma"."foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."weight_logs" ADD CONSTRAINT "weight_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."routines" ADD CONSTRAINT "routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."workouts" ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma"."mutation_receipts" ADD CONSTRAINT "mutation_receipts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "forma"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Supabase identity is the single authentication source.
ALTER TABLE "forma"."users" ADD CONSTRAINT "users_auth_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- The schema is backend-first. RLS remains enabled as defense in depth if the
-- schema is later exposed through the Supabase Data API.
REVOKE ALL ON SCHEMA "forma" FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA "forma" FROM anon;
GRANT USAGE ON SCHEMA "forma" TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "forma" TO authenticated, service_role;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','profiles','goals','foods','food_logs','favorite_foods','weight_logs','routines','workouts','mutation_receipts']
  LOOP
    EXECUTE format('ALTER TABLE forma.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

CREATE POLICY users_own ON forma.users USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY profiles_own ON forma.profiles USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY goals_own ON forma.goals USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY foods_visible ON forma.foods FOR SELECT USING (owner_id IS NULL OR owner_id = auth.uid());
CREATE POLICY foods_owned_write ON forma.foods FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY food_logs_own ON forma.food_logs USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY favorites_own ON forma.favorite_foods USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY weights_own ON forma.weight_logs USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY routines_own ON forma.routines USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY workouts_own ON forma.workouts USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY receipts_own ON forma.mutation_receipts USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
