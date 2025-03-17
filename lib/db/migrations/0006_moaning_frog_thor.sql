ALTER TABLE "Chat" DROP CONSTRAINT "Chat_parentId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_branchFromMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_branchStartMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "parentId" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "branchStartMessageId" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "parentMessageId" varchar(36);--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN IF EXISTS "branchFromMessageId";