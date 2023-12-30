CREATE TABLE IF NOT EXISTS "projects_users_roles" (
	"role_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" varchar(15) NOT NULL,
	CONSTRAINT "projects_users_roles_role_id_project_id_user_id_pk" PRIMARY KEY("role_id","project_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "projects_users" ADD CONSTRAINT "projects_users_project_id_userId_pk" PRIMARY KEY("project_id","userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_users_roles" ADD CONSTRAINT "projects_users_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_users_roles" ADD CONSTRAINT "projects_users_fk" FOREIGN KEY ("project_id","user_id") REFERENCES "projects_users"("project_id","userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
