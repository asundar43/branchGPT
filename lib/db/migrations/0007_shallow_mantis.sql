ALTER TABLE "Chat" RENAME COLUMN "parentMessageId" TO "parentBranchMessageId";--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "parentId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "parentBranchMessageId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "branchStartMessageId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Message" ADD COLUMN "isStartOfBranch" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_parentId_Chat_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_branchStartMessageId_Message_id_fk" FOREIGN KEY ("branchStartMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_parentBranchMessageId_Message_id_fk" FOREIGN KEY ("parentBranchMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
