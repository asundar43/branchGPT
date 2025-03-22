CREATE TABLE "ChatUsage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "RateLimit" CASCADE;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "freeTrialStartDate" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "freeTrialEndDate" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "chatCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastChatReset" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ChatUsage" ADD CONSTRAINT "ChatUsage_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "freeTrialStart";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "freeTrialEnd";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "isFreeTrialActive";