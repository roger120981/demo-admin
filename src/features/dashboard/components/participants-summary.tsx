'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, UserCheck, Briefcase, Heart } from 'lucide-react';
import { cn } from '@/utils/utils';
import { apiClient } from '@/config/axios';

// Tipos basados en la respuesta real
interface Participant {
  id: number;
  isActive: boolean;
  cmID: number;
  caregiverIds?: number[]; // No está presente en /participants, pendiente de resolver
  name: string;
}

interface CaseManager {
  id: number;
  name: string;
}

interface Caregiver {
  id: number;
  name: string;
}

interface DashboardData {
  participants: {
    data: Participant[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    filterCounts: { isActive: { true: number; false: number }; gender: { M: number; F: number; O: number } };
  };
  caseManagers: CaseManager[];
  caregivers: Caregiver[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const params = {
    page: 1,
    pageSize: 1000, // Aunque el backend limita a 10, lo dejamos para intentar obtener más
  };

  const [participantsRes, caseManagersRes, caregiversRes] = await Promise.all([
    apiClient.get('/participants', { params }),
    apiClient.get('/case-managers', { params }),
    apiClient.get('/caregivers', { params }),
  ]);

  return {
    participants: participantsRes.data,
    caseManagers: caseManagersRes.data.data,
    caregivers: caregiversRes.data.data,
  };
};

export function ParticipantsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="h-32 bg-gray-200 dark:bg-gray-700" />
          ))}
      </div>
    );
  }

  const participantsData = data?.participants || {
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNext: false,
    filterCounts: { isActive: { true: 0, false: 0 }, gender: { M: 0, F: 0, O: 0 } },
  };
  const participants: Participant[] = participantsData.data || [];
  const caseManagers: CaseManager[] = data?.caseManagers || [];
  const caregivers: Caregiver[] = data?.caregivers || [];

  const totalParticipants = participantsData.total;
  const activeParticipants = participantsData.filterCounts.isActive.true;
  const inactiveParticipants = participantsData.filterCounts.isActive.false;
  const activeCaseManagers = new Set(participants.map((p) => p.cmID)).size;
  const assignedCaregivers = new Set(participants.flatMap((p) => p.caregiverIds || [])).size; // Pendiente de resolver

  const caseManagerCount = caseManagers.length;
  const caregiverCount = caregivers.length;

  const metrics = [
    {
      title: 'Total Participants',
      value: totalParticipants,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      tooltip: `Total: ${totalParticipants} participants across all agencies`,
    },
    {
      title: 'Active Participants',
      value: activeParticipants,
      icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
      tooltip: `Active: ${activeParticipants} | Inactive: ${inactiveParticipants}`,
    },
    {
      title: 'Case Managers',
      value: activeCaseManagers,
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      tooltip: `Unique case managers: ${activeCaseManagers} (Total available: ${caseManagerCount})`,
    },
    {
      title: 'Assigned Caregivers',
      value: assignedCaregivers,
      icon: <Heart className="h-4 w-4 text-muted-foreground" />,
      tooltip: `Unique caregivers: ${assignedCaregivers} (Total available: ${caregiverCount})`,
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.title}
            className={cn(
              'transition-all duration-300 hover:shadow-lg animate-fade-in',
              index === 0 && 'bg-primary/10',
              index === 1 && 'bg-green-50 dark:bg-green-900/20',
              index === 2 && 'bg-blue-50 dark:bg-blue-900/20',
              index === 3 && 'bg-purple-50 dark:bg-purple-900/20'
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>{metric.icon}</TooltipTrigger>
                <TooltipContent>{metric.tooltip}</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}