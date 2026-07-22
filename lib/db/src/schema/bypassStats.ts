import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const bypassStatsTable = pgTable("bypass_stats", {
  id: text("id").primaryKey(),
  totalBypassed: integer("total_bypassed").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
