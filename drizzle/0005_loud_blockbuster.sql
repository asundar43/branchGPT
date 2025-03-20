CREATE TABLE "Customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"stripeCustomerId" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Customer_stripeCustomerId_unique" UNIQUE("stripeCustomerId")
);
--> statement-breakpoint
CREATE TABLE "Subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"stripeSubscriptionId" varchar(64) NOT NULL,
	"stripePriceId" varchar(64) NOT NULL,
	"stripeCustomerId" varchar(64) NOT NULL,
	"status" varchar NOT NULL,
	"currentPeriodStart" timestamp NOT NULL,
	"currentPeriodEnd" timestamp NOT NULL,
	"cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Subscription_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_mainChatId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_branchChatId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "mainMessageId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "createdAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD COLUMN "branchMessageId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_mainMessageId_Message_id_fk" FOREIGN KEY ("mainMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_branchMessageId_Message_id_fk" FOREIGN KEY ("branchMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_mainChatId_Chat_id_fk" FOREIGN KEY ("mainChatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_branchChatId_Chat_id_fk" FOREIGN KEY ("branchChatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "highlightStart";--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "highlightEnd";--> statement-breakpoint
DROP TYPE "public"."BranchType";