ALTER TABLE "Chat" ADD COLUMN "parentId" uuid;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "branchFromMessageId" uuid;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "branchStartMessageId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_parentId_Chat_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_branchFromMessageId_Message_id_fk" FOREIGN KEY ("branchFromMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_branchStartMessageId_Message_id_fk" FOREIGN KEY ("branchStartMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
