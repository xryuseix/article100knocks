/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const urls = sqliteTable('urls', {
  id: text('id').primaryKey().notNull(),
  url: text('url').notNull(),
  date: text('date').notNull(),
});