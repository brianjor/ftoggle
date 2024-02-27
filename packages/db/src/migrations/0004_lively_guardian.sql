CREATE TABLE IF NOT EXISTS "conditions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"feature_id" integer NOT NULL,
	"environment_id" integer NOT NULL,
	"context_field_id" uuid NOT NULL,
	"operator" text NOT NULL,
	"description" text,
	"values" text[] NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conditions" ADD CONSTRAINT "conditions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conditions" ADD CONSTRAINT "conditions_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conditions" ADD CONSTRAINT "conditions_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conditions" ADD CONSTRAINT "conditions_context_field_id_context_fields_id_fk" FOREIGN KEY ("context_field_id") REFERENCES "context_fields"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
