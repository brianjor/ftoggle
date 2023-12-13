ALTER TABLE "user_keys" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_keys" ALTER COLUMN "user_id" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "user_keys" ALTER COLUMN "hashed_password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "user_sessions" ALTER COLUMN "id" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "user_sessions" ALTER COLUMN "user_id" SET DATA TYPE varchar(15);