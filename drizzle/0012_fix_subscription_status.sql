-- Drop existing subscriptions table
DROP TABLE IF EXISTS "subscriptions" CASCADE;

-- Create subscription_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "subscription_status" AS ENUM ('active', 'canceled', 'past_due', 'unpaid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create subscription_plan enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "subscription_plan" AS ENUM ('monthly', 'annual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recreate subscriptions table with proper enum type
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" text NOT NULL,
    "stripe_customer_id" text NOT NULL,
    "stripe_subscription_id" text NOT NULL,
    "stripe_price_id" text NOT NULL,
    "status" subscription_status NOT NULL,
    "current_period_start" timestamp NOT NULL,
    "current_period_end" timestamp NOT NULL,
    "cancel_at_period_end" boolean NOT NULL DEFAULT false,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
); 