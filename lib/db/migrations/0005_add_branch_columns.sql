-- Add type and selectedText columns to BranchConnection table
ALTER TABLE "BranchConnection" 
ADD COLUMN "type" "BranchType" NOT NULL DEFAULT 'message',
ADD COLUMN "selectedText" text; 