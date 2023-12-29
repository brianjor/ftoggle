CREATE TABLE IF NOT EXISTS "environments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"project_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "features_environments" (
	"feature_id" integer NOT NULL,
	"environment_id" integer NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "features_environments_feature_id_environment_id_pk" PRIMARY KEY("feature_id","environment_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments" ADD CONSTRAINT "environments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_environments" ADD CONSTRAINT "features_environments_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_environments" ADD CONSTRAINT "features_environments_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
