CREATE TABLE `users_votes_questions` (
	`user_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `question_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`)
);
