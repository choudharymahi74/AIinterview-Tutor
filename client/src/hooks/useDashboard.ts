import { useQuery } from "@tanstack/react-query";
import type { Interview } from "@shared/schema";

export interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  confidenceLevel: number;
  practiceTime: number;
  recentInterviews: Interview[];
}

export function useDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/analytics/stats"],
    retry: false,
  });

  const { data: interviews = [], isLoading: interviewsLoading } = useQuery<Interview[]>({
    queryKey: ["/api/interviews"],
    retry: false,
  });

  return {
    stats: stats || {
      totalInterviews: 0,
      averageScore: 0,
      confidenceLevel: 0,
      practiceTime: 0,
      recentInterviews: [],
    },
    interviews,
    isLoading,
    interviewsLoading,
  };
}