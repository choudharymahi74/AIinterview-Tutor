import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Mic, Code, Briefcase, X } from "lucide-react";

const interviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  jobRole: z.string().min(1, "Job role is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  techStack: z.array(z.string()).default([]),
  voiceEnabled: z.boolean().default(false),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

const jobRoles = [
  { value: "frontend_developer", label: "Frontend Developer" },
  { value: "backend_developer", label: "Backend Developer" },
  { value: "fullstack_developer", label: "Fullstack Developer" },
  { value: "mobile_developer", label: "Mobile Developer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "product_manager", label: "Product Manager" },
  { value: "ux_designer", label: "UX Designer" },
  { value: "devops_engineer", label: "DevOps Engineer" },
  { value: "qa_engineer", label: "QA Engineer" },
  { value: "software_architect", label: "Software Architect" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-1 years)" },
  { value: "junior", label: "Junior (1-3 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior (5-8 years)" },
  { value: "lead", label: "Lead (8+ years)" },
  { value: "principal", label: "Principal (10+ years)" },
];

const commonTechStack = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", 
  "Java", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Flutter",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", 
  "Azure", "GCP", "GraphQL", "REST API", "Microservices", "System Design"
];

export function InterviewSetup() {
  const [, setLocation] = useLocation();
  const [customTech, setCustomTech] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      title: "",
      jobRole: "",
      experienceLevel: "",
      techStack: [],
      voiceEnabled: false,
    },
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (data: InterviewFormData) => {
      const response = await apiRequest("POST", "/api/interviews", data);
      return response.json();
    },
    onSuccess: (interview) => {
      toast({
        title: "Interview Created!",
        description: "Your AI interview is ready. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      setLocation(`/interview/${interview.id}`);
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
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InterviewFormData) => {
    createInterviewMutation.mutate(data);
  };

  const addTechStack = (tech: string) => {
    const currentStack = form.getValues("techStack");
    if (!currentStack.includes(tech)) {
      form.setValue("techStack", [...currentStack, tech]);
    }
  };

  const removeTechStack = (tech: string) => {
    const currentStack = form.getValues("techStack");
    form.setValue("techStack", currentStack.filter(t => t !== tech));
  };

  const addCustomTech = () => {
    if (customTech.trim()) {
      addTechStack(customTech.trim());
      setCustomTech("");
    }
  };

  const watchedTechStack = form.watch("techStack");

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Interview Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title</Label>
            <Input
              id="title"
              placeholder="e.g., Frontend Developer Interview - React Position"
              {...form.register("title")}
              data-testid="input-interview-title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Job Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="jobRole">Job Role</Label>
            <Select 
              onValueChange={(value) => form.setValue("jobRole", value)}
              data-testid="select-job-role"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your target job role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.jobRole && (
              <p className="text-sm text-red-500">{form.formState.errors.jobRole.message}</p>
            )}
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select 
              onValueChange={(value) => form.setValue("experienceLevel", value)}
              data-testid="select-experience-level"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.experienceLevel && (
              <p className="text-sm text-red-500">{form.formState.errors.experienceLevel.message}</p>
            )}
          </div>

          {/* Tech Stack Selection */}
          <div className="space-y-2">
            <Label>Tech Stack & Skills</Label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select the technologies and skills relevant to your target position
            </p>
            
            {/* Selected Tech Stack */}
            {watchedTechStack.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                {watchedTechStack.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                    data-testid={`tech-badge-${tech}`}
                  >
                    {tech}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTechStack(tech)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Common Tech Stack */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Popular Technologies:</p>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {commonTechStack.map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    variant={watchedTechStack.includes(tech) ? "default" : "outline"}
                    size="sm"
                    onClick={() => watchedTechStack.includes(tech) ? removeTechStack(tech) : addTechStack(tech)}
                    className="text-xs"
                    data-testid={`tech-button-${tech}`}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Tech Stack */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom technology..."
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTech())}
                data-testid="input-custom-tech"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addCustomTech}
                data-testid="button-add-tech"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Voice Interview Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Mic className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="voiceEnabled" className="text-base font-medium">
                  Voice-Enabled Interview
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Practice speaking out loud with real-time voice interaction
                </p>
              </div>
            </div>
            <Switch
              id="voiceEnabled"
              {...form.register("voiceEnabled")}
              data-testid="switch-voice-enabled"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white" 
            size="lg"
            disabled={createInterviewMutation.isPending}
            data-testid="button-create-interview"
          >
            {createInterviewMutation.isPending ? (
              "Creating Interview..."
            ) : (
              <>
                <Briefcase className="mr-2 h-5 w-5" />
                Start Interview
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
