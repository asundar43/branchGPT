CREATE TABLE "RateLimit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"requestCount" integer DEFAULT 0 NOT NULL,
	"lastReset" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "free_trials" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "free_trials" CASCADE;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "stripe_price_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "freeTrialStart" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "freeTrialEnd" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "isFreeTrialActive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "RateLimit" ADD CONSTRAINT "RateLimit_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;