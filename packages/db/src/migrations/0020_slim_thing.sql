-- Drop existing foreign keys
ALTER TABLE "environments" DROP CONSTRAINT "environments_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "features" DROP CONSTRAINT "features_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "projects_users" DROP CONSTRAINT "projects_users_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "projects_users_roles" DROP CONSTRAINT "projects_users_fk";--> statement-breakpoint

-- Alter columns
ALTER TABLE "environments" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "features" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects_users" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects_users_roles" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint

-- Re-add foreign keys
DO $$ BEGIN
  ALTER TABLE "environments" ADD CONSTRAINT "environments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END$$;
-->statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "features" ADD CONSTRAINT "features_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END$$;
-->statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "projects_users" ADD CONSTRAINT "projects_users_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END$$;
-->statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "projects_users_roles" ADD CONSTRAINT "projects_users_fk" FOREIGN KEY ("project_id", "user_id") REFERENCES "projects_users"("project_id","userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END$$;
