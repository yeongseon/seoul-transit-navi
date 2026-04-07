CREATE TABLE `connections` (
	`from_station_id` text NOT NULL,
	`to_station_id` text NOT NULL,
	`line_id` text NOT NULL,
	`travel_time_sec` integer NOT NULL,
	FOREIGN KEY (`from_station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`line_id`) REFERENCES `lines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exits` (
	`id` text PRIMARY KEY NOT NULL,
	`station_id` text NOT NULL,
	`exit_number` text NOT NULL,
	`label_ja` text NOT NULL,
	`description_ja` text NOT NULL,
	`walking_time_min` integer,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lines` (
	`id` text PRIMARY KEY NOT NULL,
	`line_number` integer NOT NULL,
	`name_ko` text NOT NULL,
	`name_ja` text NOT NULL,
	`name_en` text NOT NULL,
	`color` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `station_aliases` (
	`station_id` text NOT NULL,
	`alias` text NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `station_lines` (
	`station_id` text NOT NULL,
	`line_id` text NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`line_id`) REFERENCES `lines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stations` (
	`id` text PRIMARY KEY NOT NULL,
	`station_code` text NOT NULL,
	`name_ko` text NOT NULL,
	`name_ja` text NOT NULL,
	`name_en` text NOT NULL,
	`name_cn` text,
	`name_hanja` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`complexity_level` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`station_id` text NOT NULL,
	`from_line_id` text NOT NULL,
	`to_line_id` text NOT NULL,
	`transfer_time_sec` integer NOT NULL,
	`difficulty` text NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_line_id`) REFERENCES `lines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_line_id`) REFERENCES `lines`(`id`) ON UPDATE no action ON DELETE no action
);
