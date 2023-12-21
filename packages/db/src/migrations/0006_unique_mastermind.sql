CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL
);
