CREATE TABLE IF NOT EXISTS "context_fields" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "context_fields_project_id_name_unique" UNIQUE("project_id","name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "context_fields" ADD CONSTRAINT "context_fields_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
