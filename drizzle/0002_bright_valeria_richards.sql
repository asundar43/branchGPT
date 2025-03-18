ALTER TABLE "BranchConnection" ADD COLUMN "type" "BranchType" DEFAULT 'message' NOT NULL;--> statement-breakpoint
ALTER TABLE "BranchConnection" ADD COLUMN "selectedText" text;--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "highlightStart";--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "highlightEnd";--> statement-breakpoint
ALTER TABLE "BranchConnection" DROP COLUMN "highlightedText";