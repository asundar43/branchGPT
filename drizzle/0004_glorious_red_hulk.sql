CREATE TYPE "public"."BranchType" AS ENUM('message', 'highlight');--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_mainMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_branchMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_mainChatId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP CONSTRAINT "BranchConnection_branchChatId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "mainMessageId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "type" SET DATA TYPE BranchType;--> statement-breakpoint
ALTER TABLE "BranchConnection" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD COLUMN "highlightStart" integer;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD COLUMN "highlightEnd" integer;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_mainChatId_Chat_id_fk" FOREIGN KEY ("mainChatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD CONSTRAINT "BranchConnection_branchChatId_Chat_id_fk" FOREIGN KEY ("branchChatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "branchMessageId";