CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`received_at` integer NOT NULL,
	`ip_hash` text NOT NULL,
	`email_sent` integer DEFAULT false NOT NULL
);
