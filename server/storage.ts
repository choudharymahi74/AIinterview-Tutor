import {
  users,
  interviews,
  interviewQuestions,
  userPreferences,
  type User,
  type UpsertUser,
  type Interview,
  type InsertInterview,
  type InterviewQuestion,
  type InsertQuestion,
  type UserPreferences,
  type InsertUserPreferences,
  type InterviewWithQuestions,
  type UserWithPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserWithPreferences(id: string): Promise<UserWithPreferences | undefined>;
  
  // Interview operations
  createInterview(userId: string, interview: InsertInterview): Promise<Interview>;
  getInterview(id: string): Promise<Interview | undefined>;
  getInterviewWithQuestions(id: string): Promise<InterviewWithQuestions | undefined>;
  getUserInterviews(userId: string): Promise<Interview[]>;
  updateInterview(id: string, updates: Partial<Interview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;
  
  // Question operations
  addQuestionToInterview(interviewId: string, question: InsertQuestion): Promise<InterviewQuestion>;
  updateQuestionResponse(
    questionId: string, 
    response: string, 
    transcript?: string, 
    score?: number, 
    feedback?: string,
    timeSpent?: number
  ): Promise<InterviewQuestion | undefined>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(userId: string, preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Analytics operations
  getUserStats(userId: string): Promise<{
    totalInterviews: number;
    averageScore: number;
    confidenceLevel: number;
    practiceTime: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserWithPreferences(id: string): Promise<UserWithPreferences | undefined> {
    const [result] = await db
      .select()
      .from(users)
      .leftJoin(userPreferences, eq(users.id, userPreferences.userId))
      .where(eq(users.id, id));

    if (!result.users) return undefined;

    return {
      ...result.users,
      preferences: result.user_preferences || undefined,
    };
  }

  // Interview operations
  async createInterview(userId: string, interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db
      .insert(interviews)
      .values({
        ...interview,
        userId,
      })
      .returning();
    return newInterview;
  }

  async getInterview(id: string): Promise<Interview | undefined> {
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id));
    return interview;
  }

  async getInterviewWithQuestions(id: string): Promise<InterviewWithQuestions | undefined> {
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id));

    if (!interview) return undefined;

    const questions = await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.interviewId, id))
      .orderBy(interviewQuestions.orderIndex);

    return {
      ...interview,
      questions,
    };
  }

  async getUserInterviews(userId: string): Promise<Interview[]> {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(desc(interviews.createdAt));
  }

  async updateInterview(id: string, updates: Partial<Interview>): Promise<Interview | undefined> {
    const [updated] = await db
      .update(interviews)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(interviews.id, id))
      .returning();
    return updated;
  }

  async deleteInterview(id: string): Promise<boolean> {
    const result = await db
      .delete(interviews)
      .where(eq(interviews.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Question operations
  async addQuestionToInterview(interviewId: string, question: InsertQuestion): Promise<InterviewQuestion> {
    const [newQuestion] = await db
      .insert(interviewQuestions)
      .values({
        ...question,
        interviewId,
      })
      .returning();
    return newQuestion;
  }

  async updateQuestionResponse(
    questionId: string,
    response: string,
    transcript?: string,
    score?: number,
    feedback?: string,
    timeSpent?: number
  ): Promise<InterviewQuestion | undefined> {
    const updates: Partial<InterviewQuestion> = {
      userResponse: response,
    };
    
    if (transcript) updates.responseTranscript = transcript;
    if (score !== undefined) updates.responseScore = score.toString() as any;
    if (feedback) updates.responseFeedback = feedback;
    if (timeSpent !== undefined) updates.timeSpent = timeSpent;

    const [updated] = await db
      .update(interviewQuestions)
      .set(updates)
      .where(eq(interviewQuestions.id, questionId))
      .returning();
    return updated;
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(userId: string, preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [upserted] = await db
      .insert(userPreferences)
      .values({
        ...preferences,
        userId,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upserted;
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    totalInterviews: number;
    averageScore: number;
    confidenceLevel: number;
    practiceTime: number;
  }> {
    // Get total interviews count
    const [interviewCount] = await db
      .select({ count: count() })
      .from(interviews)
      .where(and(
        eq(interviews.userId, userId),
        eq(interviews.status, 'completed')
      ));

    // Get completed interviews for calculations
    const completedInterviews = await db
      .select()
      .from(interviews)
      .where(and(
        eq(interviews.userId, userId),
        eq(interviews.status, 'completed')
      ));

    const totalInterviews = interviewCount.count || 0;
    let averageScore = 0;
    let confidenceLevel = 0;
    let practiceTime = 0;

    if (completedInterviews.length > 0) {
      const scores = completedInterviews
        .filter(i => i.overallScore)
        .map(i => parseFloat(i.overallScore!));
      
      const confidenceLevels = completedInterviews
        .filter(i => i.confidenceLevel)
        .map(i => parseFloat(i.confidenceLevel!));

      const durations = completedInterviews
        .filter(i => i.duration)
        .map(i => i.duration!);

      averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;

      confidenceLevel = confidenceLevels.length > 0
        ? confidenceLevels.reduce((a, b) => a + b, 0) / confidenceLevels.length
        : 0;

      practiceTime = durations.reduce((a, b) => a + b, 0);
    }

    return {
      totalInterviews,
      averageScore: Math.round(averageScore * 100) / 100,
      confidenceLevel: Math.round(confidenceLevel * 100) / 100,
      practiceTime: Math.round(practiceTime / 60), // Convert to hours
    };
  }
}

export const storage = new DatabaseStorage();
