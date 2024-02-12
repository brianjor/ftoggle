ALTER TABLE "users" ADD COLUMN "is_approved" boolean DEFAULT false NOT NULL;
--> statement-breakpoint

-- Set Admin to approved
UPDATE "users"
SET "is_approved" = true
WHERE "username" = 'Admin'
