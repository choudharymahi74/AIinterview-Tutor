import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job roles enum
export const jobRoleEnum = pgEnum('job_role', [
  'frontend_developer',
  'backend_developer',
  'fullstack_developer',
  'mobile_developer',
  'data_scientist',
  'product_manager',
  'ux_designer',
  'devops_engineer',
  'qa_engineer',
  'software_architect',
]);

// Experience level enum
export const experienceLevelEnum = pgEnum('experience_level', [
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'principal',
]);

// Interview status enum
export const interviewStatusEnum = pgEnum('interview_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

// Interviews table
export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  jobRole: jobRoleEnum("job_role").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  techStack: text("tech_stack").array(),
  status: interviewStatusEnum("status").default('pending'),
  duration: integer("duration"), // in minutes
  totalQuestions: integer("total_questions").default(8),
  currentQuestion: integer("current_question").default(0),
  overallScore: decimal("overall_score", { precision: 3, scale: 2 }),
  confidenceLevel: decimal("confidence_level", { precision: 3, scale: 2 }),
  communicationScore: decimal("communication_score", { precision: 3, scale: 2 }),
  technicalScore: decimal("technical_score", { precision: 3, scale: 2 }),
  feedback: text("feedback"),
  voiceEnabled: boolean("voice_enabled").default(false),
  roomName: varchar("room_name"), // LiveKit room identifier
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview questions table
export const interviewQuestions = pgTable("interview_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  interviewId: varchar("interview_id").notNull().references(() => interviews.id, { onDelete: 'cascade' }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type").notNull(), // 'technical', 'behavioral', 'situational'
  orderIndex: integer("order_index").notNull(),
  userResponse: text("user_response"),
  responseTranscript: text("response_transcript"),
  responseScore: decimal("response_score", { precision: 3, scale: 2 }),
  responseFeedback: text("response_feedback"),
  timeSpent: integer("time_spent"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  preferredJobRole: jobRoleEnum("preferred_job_role"),
  preferredExperienceLevel: experienceLevelEnum("preferred_experience_level"),
  preferredTechStack: text("preferred_tech_stack").array(),
  voiceEnabledByDefault: boolean("voice_enabled_by_default").default(true),
  darkMode: boolean("dark_mode").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  interviews: many(interviews),
  preferences: one(userPreferences),
}));

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  user: one(users, {
    fields: [interviews.userId],
    references: [users.id],
  }),
  questions: many(interviewQuestions),
}));

export const interviewQuestionsRelations = relations(interviewQuestions, ({ one }) => ({
  interview: one(interviews, {
    fields: [interviewQuestions.interviewId],
    references: [interviews.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).pick({
  title: true,
  jobRole: true,
  experienceLevel: true,
  techStack: true,
  voiceEnabled: true,
});

export const insertQuestionSchema = createInsertSchema(interviewQuestions).pick({
  questionText: true,
  questionType: true,
  orderIndex: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  preferredJobRole: true,
  preferredExperienceLevel: true,
  preferredTechStack: true,
  voiceEnabledByDefault: true,
  darkMode: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Extended types with relations
export type InterviewWithQuestions = Interview & {
  questions: InterviewQuestion[];
};

export type UserWithPreferences = User & {
  preferences?: UserPreferences;
};
