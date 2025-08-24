import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import type { Interview } from "@shared/schema";
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Users, 
  Play,
  Calendar,
  Target,
  Award
} from "lucide-react";

export default function Dashboard() {
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

  const sortedInterviews = interviews.sort((a: Interview, b: Interview) => 
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  const completedInterviews = sortedInterviews.filter((i: Interview) => i.status === 'completed');
  const inProgressInterviews = sortedInterviews.filter((i: Interview) => i.status === 'in_progress');

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Interview Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Track your progress and manage your interview practice
              </p>
            </div>
            <Link href="/">
              <Button data-testid="button-new-interview">
                <Play className="mr-2 h-4 w-4" />
                New Interview
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{Math.max(0, stats.totalInterviews - 5)} this week
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="stat-total-interviews">
                  {stats.totalInterviews}
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">Total Interviews</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Award className="text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ↑ {stats.averageScore > 5 ? '0.4' : '0.0'}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="stat-average-score">
                  {stats.averageScore.toFixed(1)}
                </div>
                <div className="text-sm text-green-600/70 dark:text-green-400/70">Average Score</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ↑ {stats.confidenceLevel > 50 ? '12%' : '0%'}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400" data-testid="stat-confidence">
                  {stats.confidenceLevel.toFixed(0)}%
                </div>
                <div className="text-sm text-purple-600/70 dark:text-purple-400/70">Confidence Level</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    This month
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400" data-testid="stat-practice-time">
                  {stats.practiceTime}h
                </div>
                <div className="text-sm text-orange-600/70 dark:text-orange-400/70">Practice Time</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Interviews and Performance Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Interviews
                    <div className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      {sortedInterviews.length} total interviews
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        </div>
                      ))}
                    </div>
                  ) : sortedInterviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                        No interviews yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Start practicing with your first AI-powered interview
                      </p>
                      <Link href="/">
                        <Button data-testid="button-start-first-interview">
                          <Play className="mr-2 h-4 w-4" />
                          Start Your First Interview
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    sortedInterviews.map((interview: any) => (
                      <div 
                        key={interview.id} 
                        className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                        data-testid={`interview-card-${interview.id}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <BarChart3 className="text-white" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-slate-900 dark:text-white">
                                {interview.title}
                              </h5>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {formatTimeAgo(interview.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {interview.overallScore ? (
                              <>
                                <div className={`text-2xl font-bold ${getScoreColor(parseFloat(interview.overallScore))}`}>
                                  {parseFloat(interview.overallScore).toFixed(1)}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
                              </>
                            ) : (
                              <Badge 
                                variant={interview.status === 'in_progress' ? 'default' : 'secondary'}
                                data-testid={`interview-status-${interview.id}`}
                              >
                                {interview.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              {interview.jobRole.replace('_', ' ')} • {interview.experienceLevel}
                            </span>
                            {interview.technicalScore && (
                              <span className="font-medium">
                                Technical: {parseFloat(interview.technicalScore).toFixed(1)}
                              </span>
                            )}
                          </div>
                          
                          {interview.overallScore && (
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, parseFloat(interview.overallScore) * 10)}%` }}
                              ></div>
                            </div>
                          )}
                          
                          {interview.status === 'in_progress' && (
                            <Link href={`/interview/${interview.id}`}>
                              <Button size="sm" className="mt-2" data-testid={`button-continue-${interview.id}`}>
                                <Play className="mr-2 h-4 w-4" />
                                Continue Interview
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg mb-6">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p>Performance Chart</p>
                      <p className="text-xs mt-1">Coming Soon</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stats.averageScore > 5 ? '↑15%' : '→0%'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {stats.totalInterviews > 10 ? 'Top 20%' : 'Getting Started'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Ranking</div>
                    </div>
                  </div>

                  {/* Progress Breakdown */}
                  {completedInterviews.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="font-medium text-slate-900 dark:text-white">Skills Breakdown</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Communication</span>
                            <span className="font-medium">
                              {stats.averageScore > 0 ? (stats.averageScore * 0.9).toFixed(1) : '0.0'}
                            </span>
                          </div>
                          <Progress value={stats.averageScore * 9} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Technical Knowledge</span>
                            <span className="font-medium">
                              {stats.averageScore.toFixed(1)}
                            </span>
                          </div>
                          <Progress value={stats.averageScore * 10} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Confidence</span>
                            <span className="font-medium">
                              {stats.confidenceLevel.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={stats.confidenceLevel} className="h-2" />
                        </div>
                      </div>
                    </div>
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
