CREATE TABLE "ChatBranches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mainChatId" uuid NOT NULL,
	"branchedChatId" uuid NOT NULL,
	"mainMessageId" uuid NOT NULL,
	"branchMessageId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_branchFromChatId_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_branchFromMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_branchStartMessageId_Message_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "parentId" SET DATA TYPE varchar(36);
--> statement-breakpoint
ALTER TABLE "ChatBranches" ADD CONSTRAINT "ChatBranches_mainChatId_Chat_id_fk" FOREIGN KEY ("mainChatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ChatBranches" ADD CONSTRAINT "ChatBranches_branchedChatId_Chat_id_fk" FOREIGN KEY ("branchedChatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ChatBranches" ADD CONSTRAINT "ChatBranches_mainMessageId_Message_id_fk" FOREIGN KEY ("mainMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ChatBranches" ADD CONSTRAINT "ChatBranches_branchMessageId_Message_id_fk" FOREIGN KEY ("branchMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "unq_branched_chat" ON "ChatBranches" USING btree ("branchedChatId");
--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "branchFromChatId";
--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "branchFromMessageId";
--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "branchStartMessageId";