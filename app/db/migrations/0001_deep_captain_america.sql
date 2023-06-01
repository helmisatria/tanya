CREATE TABLE `questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text,
	`answer` text,
	`label` text,
	`questioner_id` integer
);
