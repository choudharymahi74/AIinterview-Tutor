import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { geminiService } from "./services/gemini";
import { liveKitService } from "./services/livekit";
import { insertInterviewSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithPreferences(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User preferences routes
  app.get('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.upsertUserPreferences(userId, validatedData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Interview routes
  app.get('/api/interviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interviews = await storage.getUserInterviews(userId);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.post('/api/interviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertInterviewSchema.parse(req.body);
      
      // Create interview
      const interview = await storage.createInterview(userId, validatedData);
      
      // Generate questions using Gemini
      const questions = await geminiService.generateInterviewQuestions({
        jobRole: interview.jobRole,
        experienceLevel: interview.experienceLevel,
        techStack: interview.techStack || [],
        questionCount: interview.totalQuestions || 8,
      });

      // Save questions to database
      for (let i = 0; i < questions.length; i++) {
        await storage.addQuestionToInterview(interview.id, {
          questionText: questions[i].question,
          questionType: questions[i].type,
          orderIndex: i,
        });
      }

      // Create LiveKit room if voice enabled
      if (interview.voiceEnabled) {
        const roomName = await liveKitService.createInterviewRoom(interview.id);
        await storage.updateInterview(interview.id, { roomName });
      }

      const fullInterview = await storage.getInterviewWithQuestions(interview.id);
      res.json(fullInterview);
    } catch (error) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to create interview" });
    }
  });

  app.get('/api/interviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interview = await storage.getInterviewWithQuestions(req.params.id);
      
      if (!interview || interview.userId !== userId) {
        return res.status(404).json({ message: "Interview not found" });
      }

      res.json(interview);
    } catch (error) {
      console.error("Error fetching interview:", error);
      res.status(500).json({ message: "Failed to fetch interview" });
    }
  });

  app.patch('/api/interviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interview = await storage.getInterview(req.params.id);
      
      if (!interview || interview.userId !== userId) {
        return res.status(404).json({ message: "Interview not found" });
      }

      const updated = await storage.updateInterview(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating interview:", error);
      res.status(500).json({ message: "Failed to update interview" });
    }
  });

  app.delete('/api/interviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interview = await storage.getInterview(req.params.id);
      
      if (!interview || interview.userId !== userId) {
        return res.status(404).json({ message: "Interview not found" });
      }

      // End LiveKit room if exists
      if (interview.roomName) {
        await liveKitService.endInterviewRoom(interview.roomName);
      }

      const deleted = await storage.deleteInterview(req.params.id);
      res.json({ success: deleted });
    } catch (error) {
      console.error("Error deleting interview:", error);
      res.status(500).json({ message: "Failed to delete interview" });
    }
  });

  // Question response routes
  app.post('/api/questions/:id/response', isAuthenticated, async (req: any, res) => {
    try {
      const { response, transcript, timeSpent } = req.body;
      
      if (!response) {
        return res.status(400).json({ message: "Response is required" });
      }

      // Get question and interview details for evaluation
      const question = await storage.updateQuestionResponse(
        req.params.id,
        response,
        transcript,
        undefined, // score will be added after evaluation
        undefined, // feedback will be added after evaluation
        timeSpent
      );

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Get interview for context
      const interview = await storage.getInterview(question.interviewId);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      // Evaluate response using Gemini
      const evaluation = await geminiService.evaluateResponse({
        question: question.questionText,
        response,
        jobRole: interview.jobRole,
        experienceLevel: interview.experienceLevel,
      });

      // Update question with evaluation results
      const updatedQuestion = await storage.updateQuestionResponse(
        req.params.id,
        response,
        transcript,
        evaluation.score,
        evaluation.feedback,
        timeSpent
      );

      res.json({
        question: updatedQuestion,
        evaluation,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      res.status(500).json({ message: "Failed to submit response" });
    }
  });

  // LiveKit token generation
  app.post('/api/interviews/:id/token', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interview = await storage.getInterview(req.params.id);
      
      if (!interview || interview.userId !== userId) {
        return res.status(404).json({ message: "Interview not found" });
      }

      if (!interview.roomName) {
        return res.status(400).json({ message: "Interview does not have voice enabled" });
      }

      const user = await storage.getUser(userId);
      const participantName = user?.firstName || user?.email || `User-${userId}`;

      const token = await liveKitService.generateAccessToken(
        interview.roomName,
        participantName,
        userId
      );

      res.json({ 
        token, 
        wsUrl: process.env.LIVEKIT_URL || 'wss://your-livekit-instance.livekit.cloud',
        roomName: interview.roomName
      });
    } catch (error) {
      console.error("Error generating LiveKit token:", error);
      res.status(500).json({ message: "Failed to generate access token" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Interview completion route
  app.post('/api/interviews/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interview = await storage.getInterviewWithQuestions(req.params.id);
      
      if (!interview || interview.userId !== userId) {
        return res.status(404).json({ message: "Interview not found" });
      }

      // Calculate overall scores
      const questionScores = interview.questions
        .filter(q => q.responseScore)
        .map(q => parseFloat(q.responseScore!));

      const communicationScores = interview.questions
        .filter(q => q.responseScore) // Simplified for now
        .map(q => parseFloat(q.responseScore!) * 0.8); // Communication component

      const technicalScores = interview.questions
        .filter(q => q.questionType === 'technical' && q.responseScore)
        .map(q => parseFloat(q.responseScore!));

      const overallScore = questionScores.length > 0
        ? questionScores.reduce((a, b) => a + b, 0) / questionScores.length
        : 0;

      const communicationScore = communicationScores.length > 0
        ? communicationScores.reduce((a, b) => a + b, 0) / communicationScores.length
        : 0;

      const technicalScore = technicalScores.length > 0
        ? technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length
        : overallScore;

      // Generate overall feedback
      const evaluations = interview.questions
        .filter(q => q.responseScore && q.responseFeedback)
        .map(q => ({
          score: parseFloat(q.responseScore!),
          feedback: q.responseFeedback!,
          strengths: [],
          improvements: [],
          confidenceLevel: 75, // Simplified
          communicationScore: communicationScore,
          technicalScore: technicalScore,
        }));

      const overallFeedback = evaluations.length > 0
        ? await geminiService.generateOverallFeedback(evaluations)
        : "Complete more questions to receive detailed feedback.";

      // Update interview with final scores
      const completedInterview = await storage.updateInterview(req.params.id, {
        status: 'completed' as any,
        overallScore: overallScore.toString() as any,
        communicationScore: communicationScore.toString() as any,
        technicalScore: technicalScore.toString() as any,
        confidenceLevel: '80', // Simplified calculation
        feedback: overallFeedback,
        duration: req.body.duration || 30,
      });

      // End LiveKit room
      if (interview.roomName) {
        await liveKitService.endInterviewRoom(interview.roomName);
      }

      res.json(completedInterview);
    } catch (error) {
      console.error("Error completing interview:", error);
      res.status(500).json({ message: "Failed to complete interview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
