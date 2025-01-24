CREATE TABLE `documents_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` varchar(255),
	`subject` bigint unsigned NOT NULL,
	`owner` bigint unsigned NOT NULL,
	`is_final` boolean NOT NULL,
	`revised_at` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `documents_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions_table` (
	`id` varchar(36) NOT NULL,
	`expires_at` datetime NOT NULL,
	`user` bigint unsigned NOT NULL,
	CONSTRAINT `sessions_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_table_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjects_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `subjects_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` longtext NOT NULL,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `documents_table` ADD CONSTRAINT `documents_table_subject_subjects_table_id_fk` FOREIGN KEY (`subject`) REFERENCES `subjects_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents_table` ADD CONSTRAINT `documents_table_owner_users_table_id_fk` FOREIGN KEY (`owner`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions_table` ADD CONSTRAINT `sessions_table_user_users_table_id_fk` FOREIGN KEY (`user`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;