CREATE TABLE `users_roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`delete_documents` boolean DEFAULT false,
	`create_documents` boolean DEFAULT false,
	CONSTRAINT `users_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users_table` ADD `role_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `users_table` ADD CONSTRAINT `users_table_role_id_users_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `users_roles`(`id`) ON DELETE set null ON UPDATE no action;