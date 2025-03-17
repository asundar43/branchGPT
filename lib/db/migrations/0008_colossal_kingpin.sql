ALTER TABLE "Chat" DROP CONSTRAINT "Chat_parentId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_parentBranchMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "branchFromChatId" uuid;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "branchFromMessageId" uuid;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_branchFromChatId_Chat_id_fk" FOREIGN KEY ("branchFromChatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_branchFromMessageId_Message_id_fk" FOREIGN KEY ("branchFromMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "parentId";--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "parentBranchMessageId";--> statement-breakpoint
ALTER TABLE "Message" DROP COLUMN "isStartOfBranch";