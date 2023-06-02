CREATE TABLE `questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`label` text,
	`questioner_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`google_id` text,
	`email` text NOT NULL,
	`name` text NOT NULL
);

CREATE TABLE `users_votes_questions` (
	`user_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `question_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`)
);

CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);
CREATE UNIQUE INDEX `google_id_idx` ON `users` (`google_id`);