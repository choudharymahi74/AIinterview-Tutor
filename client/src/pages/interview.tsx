import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { InterviewFeedback } from "@/components/interview-feedback";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward, 
  Clock, 
  User,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Volume2,
  VolumeX
} from "lucide-react";

export default function Interview() {
  const params = useParams();
  const interviewId = params.id;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Interview state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Voice state
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch interview data
  const { data: interview, isLoading, error } = useQuery({
    queryKey: ["/api/interviews", interviewId],
    retry: false,
    enabled: !!interviewId,
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: async ({ questionId, response, transcript, timeSpent }: {
      questionId: string;
      response: string;
      transcript?: string;
      timeSpent: number;
    }) => {
      const res = await apiRequest("POST", `/api/questions/${questionId}/response`, {
        response,
        transcript,
        timeSpent,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Response Submitted",
        description: "Your answer has been recorded and analyzed.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete interview mutation
  const completeInterviewMutation = useMutation({
    mutationFn: async () => {
      const duration = interviewStartTime 
        ? Math.floor((new Date().getTime() - interviewStartTime.getTime()) / 1000 / 60)
        : 30;
      
      const res = await apiRequest("POST", `/api/interviews/${interviewId}/complete`, {
        duration,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Interview Completed!",
        description: "Great job! Your feedback is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      setShowFeedback(true);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to complete interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (!isPaused && startTime && !showFeedback) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, startTime, showFeedback]);

  // Start interview effect
  useEffect(() => {
    if (interview && !interviewStartTime) {
      setInterviewStartTime(new Date());
      setStartTime(new Date());
    }
  }, [interview, interviewStartTime]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserResponse(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

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

  const toggleRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const pauseInterview = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const submitResponse = async () => {
    if (!interview?.questions[currentQuestionIndex] || !userResponse.trim()) {
      toast({
        title: "Missing Response",
        description: "Please provide an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    const question = interview.questions[currentQuestionIndex];
    await submitResponseMutation.mutateAsync({
      questionId: question.id,
      response: userResponse.trim(),
      transcript: isListening ? userResponse : undefined,
      timeSpent,
    });

    // Move to next question or complete
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserResponse("");
      setTimeSpent(0);
      setStartTime(new Date());
    } else {
      await completeInterviewMutation.mutateAsync();
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserResponse("");
      setTimeSpent(0);
      setStartTime(new Date());
    }
  };

  const endInterview = async () => {
    if (confirm("Are you sure you want to end this interview? Your progress will be saved.")) {
      await completeInterviewMutation.mutateAsync();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            <p className="text-slate-600 dark:text-slate-300">Loading interview...</p>
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
                Interview Not Found
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                The interview you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button asChild data-testid="button-back-home">
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return <InterviewFeedback interviewId={interviewId!} />;
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;
  const totalInterviewTime = interviewStartTime 
    ? Math.floor((new Date().getTime() - interviewStartTime.getTime()) / 1000)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <div className="pt-16">
        {/* Interview Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">LIVE INTERVIEW</span>
              </div>
              <div className="text-slate-400 text-sm">{interview.title}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-slate-400 text-sm">
                {formatTime(totalInterviewTime)} / 30:00
              </div>
              <Button 
                variant="destructive"
                size="sm"
                onClick={endInterview}
                disabled={completeInterviewMutation.isPending}
                data-testid="button-end-interview"
              >
                End Interview
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Interview Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Interviewer Section */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                    <User className="text-white text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Alex - AI Interviewer</h3>
                  <p className="text-slate-300 text-sm">
                    {interview.jobRole.replace('_', ' ')} Technical Lead
                  </p>
                </CardContent>
              </Card>

              {/* Current Question */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">
                        Question {currentQuestionIndex + 1} of {interview.questions.length}
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-lg">
                        {currentQuestion?.questionText}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="mt-3 text-slate-400 border-slate-600"
                      >
                        {currentQuestion?.questionType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Area */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4">Your Response</h4>
                  <Textarea
                    placeholder="Type your answer here or use voice recording..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[120px] resize-none"
                    data-testid="textarea-response"
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-400">
                      Time on question: {formatTime(timeSpent)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={skipQuestion}
                        disabled={currentQuestionIndex >= interview.questions.length - 1}
                        data-testid="button-skip-question"
                      >
                        <SkipForward className="mr-2 h-4 w-4" />
                        Skip
                      </Button>
                      <Button
                        onClick={submitResponse}
                        disabled={submitResponseMutation.isPending || !userResponse.trim()}
                        data-testid="button-submit-response"
                      >
                        {submitResponseMutation.isPending ? (
                          "Submitting..."
                        ) : currentQuestionIndex < interview.questions.length - 1 ? (
                          "Next Question"
                        ) : (
                          "Complete Interview"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Controls */}
              {interview.voiceEnabled && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="text-white font-medium mb-4">Voice Controls</h4>
                    <div className="flex items-center justify-center space-x-6">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={toggleMute}
                        className="w-16 h-16 bg-slate-700 hover:bg-slate-600 rounded-full"
                        data-testid="button-toggle-mute"
                      >
                        {isMuted ? (
                          <VolumeX className="text-white text-xl" />
                        ) : (
                          <Volume2 className="text-white text-xl" />
                        )}
                      </Button>
                      
                      <Button
                        size="lg"
                        onClick={pauseInterview}
                        className="w-20 h-20 bg-primary hover:bg-primary/90 rounded-full"
                        data-testid="button-pause-interview"
                      >
                        {isPaused ? (
                          <Play className="text-white text-2xl" />
                        ) : (
                          <Pause className="text-white text-2xl" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={toggleRecording}
                        className={`w-16 h-16 rounded-full ${
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        data-testid="button-toggle-recording"
                      >
                        {isListening ? (
                          <MicOff className="text-white text-xl" />
                        ) : (
                          <Mic className="text-white text-xl" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Voice Indicator */}
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isListening ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                        }`}></div>
                        <span className={`text-sm ${
                          isListening ? 'text-green-400' : 'text-slate-500'
                        }`}>
                          {isListening ? 'Listening...' : 'Click mic to start recording'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Interview Progress & Notes */}
            <div className="space-y-6">
              {/* Progress */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4">Interview Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Questions</span>
                        <span className="text-white">
                          {currentQuestionIndex + 1}/{interview.questions.length}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Time</span>
                        <span className="text-white">{formatTime(totalInterviewTime)}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (totalInterviewTime / 1800) * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4">Questions Overview</h4>
                  <div className="space-y-2">
                    {interview.questions.map((question: any, index: number) => (
                      <div 
                        key={question.id} 
                        className={`flex items-center space-x-3 p-2 rounded ${
                          index === currentQuestionIndex 
                            ? 'bg-primary/20 border border-primary/30' 
                            : ''
                        }`}
                      >
                        {index < currentQuestionIndex ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : index === currentQuestionIndex ? (
                          <div className="h-4 w-4 bg-primary rounded-full"></div>
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500" />
                        )}
                        <span className={`text-sm ${
                          index === currentQuestionIndex 
                            ? 'text-white font-medium' 
                            : 'text-slate-400'
                        }`}>
                          Question {index + 1}
                        </span>
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className="text-xs text-slate-400 border-slate-600"
                        >
                          {question.questionType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Notes */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4">Quick Notes</h4>
                  <Textarea
                    placeholder="Jot down key points..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm resize-none"
                    rows={4}
                    data-testid="textarea-notes"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
