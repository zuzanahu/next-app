ALTER TABLE `sessions_table` RENAME COLUMN `user` TO `user_id`;--> statement-breakpoint
ALTER TABLE `sessions_table` DROP FOREIGN KEY `sessions_table_user_users_table_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessions_table` ADD CONSTRAINT `sessions_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;