import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowLeft,
  Award,
  BarChart3,
  TrendingUp,
  MessageCircle,
  Code,
  Clock,
  CheckCircle2,
  Target,
  Star,
  Download,
  Share2
} from "lucide-react";

interface InterviewFeedbackProps {
  interviewId: string;
}

export function InterviewFeedback({ interviewId }: InterviewFeedbackProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: interview, isLoading, error } = useQuery({
    queryKey: ["/api/interviews", interviewId],
    retry: false,
    enabled: !!interviewId,
  });

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading your feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Feedback Not Available
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Unable to load interview feedback. Please try again.
              </p>
              <Button asChild data-testid="button-back-dashboard">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const overallScore = interview.overallScore ? parseFloat(interview.overallScore) : 0;
  const communicationScore = interview.communicationScore ? parseFloat(interview.communicationScore) : 0;
  const technicalScore = interview.technicalScore ? parseFloat(interview.technicalScore) : 0;
  const confidenceLevel = interview.confidenceLevel ? parseFloat(interview.confidenceLevel) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Above Average';
    if (score >= 5) return 'Average';
    return 'Needs Improvement';
  };

  const answeredQuestions = interview.questions?.filter((q: any) => q.userResponse) || [];
  const completionRate = interview.questions?.length 
    ? (answeredQuestions.length / interview.questions.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Interview Feedback
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {interview.title}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" data-testid="button-download-feedback">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" data-testid="button-share-feedback">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button asChild data-testid="button-new-interview">
                <Link href="/">
                  Start New Interview
                </Link>
              </Button>
            </div>
          </div>

          {/* Celebration Header */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                🎉 Great Job Completing Your Interview!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                You've taken an important step in your career journey. Here's your detailed feedback.
              </p>
            </CardContent>
          </Card>

          {/* Overall Score Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-white text-2xl" />
                </div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`} data-testid="overall-score">
                  {overallScore.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Overall Score</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {getScoreLevel(overallScore)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="text-white text-xl" />
                </div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(communicationScore)}`} data-testid="communication-score">
                  {communicationScore.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Communication</div>
                <Progress value={communicationScore * 10} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Code className="text-white text-xl" />
                </div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(technicalScore)}`} data-testid="technical-score">
                  {technicalScore.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Technical Skills</div>
                <Progress value={technicalScore * 10} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="text-white text-xl" />
                </div>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2" data-testid="confidence-level">
                  {confidenceLevel.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Confidence</div>
                <Progress value={confidenceLevel} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Detailed Feedback */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Feedback */}
              {interview.feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Overall Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {interview.feedback}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Question by Question Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {answeredQuestions.map((question: any, index: number) => (
                    <div key={question.id} className="border-l-4 border-primary/30 pl-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                            Question {index + 1}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                            {question.questionText}
                          </p>
                          <Badge variant="outline" size="sm">
                            {question.questionType}
                          </Badge>
                        </div>
                        {question.responseScore && (
                          <div className="text-right ml-4">
                            <div className={`text-2xl font-bold ${getScoreColor(parseFloat(question.responseScore))}`}>
                              {parseFloat(question.responseScore).toFixed(1)}
                            </div>
                            <div className="text-xs text-slate-500">Score</div>
                          </div>
                        )}
                      </div>
                      
                      {question.userResponse && (
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-3">
                          <h5 className="font-medium text-slate-900 dark:text-white mb-2">Your Response:</h5>
                          <p className="text-slate-700 dark:text-slate-300 text-sm">
                            {question.userResponse}
                          </p>
                        </div>
                      )}
                      
                      {question.responseFeedback && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">AI Feedback:</h5>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {question.responseFeedback}
                          </p>
                        </div>
                      )}
                      
                      {index < answeredQuestions.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Interview Statistics and Next Steps */}
            <div className="space-y-6">
              {/* Interview Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Interview Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Completion Rate</span>
                    <div className="text-right">
                      <span className="font-medium">{completionRate.toFixed(0)}%</span>
                      <Progress value={completionRate} className="h-2 w-20 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Questions Answered</span>
                    <span className="font-medium">
                      {answeredQuestions.length}/{interview.questions?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Interview Duration</span>
                    <span className="font-medium">
                      {interview.duration ? `${interview.duration} min` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Job Role</span>
                    <span className="font-medium">
                      {interview.jobRole?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Experience Level</span>
                    <span className="font-medium">{interview.experienceLevel}</span>
                  </div>
                  
                  {interview.techStack && interview.techStack.length > 0 && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block mb-2">Tech Stack</span>
                      <div className="flex flex-wrap gap-1">
                        {interview.techStack.map((tech: string) => (
                          <Badge key={tech} variant="outline" size="sm">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">vs. Average Candidate</span>
                        <span className={`font-medium ${overallScore > 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {overallScore > 7 ? 'Above Average' : 'Average'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(100, (overallScore / 10) * 100)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Industry Benchmark</span>
                        <span className={`font-medium ${overallScore > 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {overallScore > 8 ? 'Exceeds' : 'Meets'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(100, (overallScore / 10) * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">Key Strengths</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {communicationScore > 7 && (
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-green-500" />
                          Strong communication skills
                        </li>
                      )}
                      {technicalScore > 7 && (
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-green-500" />
                          Solid technical knowledge
                        </li>
                      )}
                      {confidenceLevel > 75 && (
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-green-500" />
                          High confidence level
                        </li>
                      )}
                      {completionRate > 80 && (
                        <li className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-green-500" />
                          Great completion rate
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      asChild
                      data-testid="button-practice-again"
                    >
                      <Link href="/">
                        <Clock className="mr-2 h-4 w-4" />
                        Practice Another Interview
                      </Link>
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      asChild
                      data-testid="button-view-dashboard"
                    >
                      <Link href="/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Progress Dashboard
                      </Link>
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      data-testid="button-download-detailed"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Detailed Report
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Ready for the real thing?
                    </p>
                    <Button className="w-full" data-testid="button-job-search">
                      Start Job Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
