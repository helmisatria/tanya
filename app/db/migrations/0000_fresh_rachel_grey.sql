CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text,
	`name` text
);

CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);