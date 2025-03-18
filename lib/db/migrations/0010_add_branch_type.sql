-- Add branch type enum
CREATE TYPE "BranchType" AS ENUM ('message', 'highlight');

-- Add type column to BranchConnection table
ALTER TABLE "BranchConnection" ADD COLUMN "type" "BranchType" NOT NULL DEFAULT 'message';

-- Add selected text column for highlight branches
ALTER TABLE "BranchConnection" ADD COLUMN "selectedText" TEXT; 