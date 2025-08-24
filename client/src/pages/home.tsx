import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { InterviewSetup } from "@/components/interview-setup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Interview } from "@shared/schema";
import { BarChart3, Clock, TrendingUp, Plus, Play } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { stats, interviews, isLoading: dashboardLoading } = useDashboard();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;
  }

  const recentInterviews = interviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Ready to practice your interview skills? Let's get started.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Interviews</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-total-interviews">
                      {stats.totalInterviews}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-average-score">
                      {stats.averageScore.toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Confidence</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-confidence">
                      {stats.confidenceLevel.toFixed(0)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Practice Time</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-practice-time">
                      {stats.practiceTime}h
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Start */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Start New Interview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InterviewSetup />
                </CardContent>
              </Card>
            </div>

            {/* Recent Interviews */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Interviews
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" data-testid="link-view-all-interviews">
                        View All
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentInterviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        No interviews yet
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Start your first interview to see it here
                      </p>
                    </div>
                  ) : (
                    recentInterviews.map((interview: any) => (
                      <div key={interview.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {interview.title}
                          </h4>
                          <Badge 
                            variant={interview.status === 'completed' ? 'default' : 'secondary'}
                            data-testid={`interview-status-${interview.id}`}
                          >
                            {interview.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {interview.jobRole.replace('_', ' ')} • {interview.experienceLevel}
                        </p>
                        {interview.overallScore && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Score:</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {parseFloat(interview.overallScore).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                        {interview.status === 'in_progress' && (
                          <Link href={`/interview/${interview.id}`}>
                            <Button size="sm" className="mt-2 w-full" data-testid={`button-continue-${interview.id}`}>
                              <Play className="mr-2 h-4 w-4" />
                              Continue Interview
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
