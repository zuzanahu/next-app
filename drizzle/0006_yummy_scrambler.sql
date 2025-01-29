ALTER TABLE `documents_table` DROP FOREIGN KEY `documents_table_subject_id_subjects_table_id_fk`;
--> statement-breakpoint
ALTER TABLE `documents_table` DROP FOREIGN KEY `documents_table_owner_id_users_table_id_fk`;
--> statement-breakpoint
ALTER TABLE `documents_table` MODIFY COLUMN `owner_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `documents_table` ADD CONSTRAINT `documents_table_subject_id_subjects_table_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subjects_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents_table` ADD CONSTRAINT `documents_table_owner_id_users_table_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users_table`(`id`) ON DELETE set null ON UPDATE no action;