DROP TABLE "projects_users";--> statement-breakpoint
DROP TABLE "projects_users_roles";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_github_id_unique" UNIQUE("github_id");