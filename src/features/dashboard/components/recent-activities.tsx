'use client';

import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { apiClient } from '@/config/axios';
import { formatDistanceToNow } from 'date-fns';

interface Participant {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ParticipantsResponse {
  data: Participant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  filterCounts: { isActive: { true: number; false: number }; gender: { M: number; F: number; O: number } };
}

const fetchParticipants = async (): Promise<ParticipantsResponse> => {
  const params = {
    page: 1,
    pageSize: 1000,
  };
  const response = await apiClient.get('/participants', { params });
  return response.data;
};

export function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchParticipants,
  });

  if (isLoading) {
    return (
      <CardContent>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }

  const participants = data?.data || [];

  // Ordenar por updatedAt (más reciente primero) y tomar los 5 primeros
  const recentParticipants = participants
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <CardContent>
      <div className="space-y-4">
        {recentParticipants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity available.</p>
        ) : (
          recentParticipants.map((participant, index) => {
            const isCreated = new Date(participant.createdAt).getTime() === new Date(participant.updatedAt).getTime();
            const action = isCreated ? 'Created' : 'Updated';
            const actionColor = isCreated ? 'text-green-600' : 'text-blue-600';

            return (
              <div
                key={participant.id}
                className={`flex items-center space-x-4 ${
                  index < recentParticipants.length - 1 ? 'pb-4 border-b border-gray-200 dark:border-gray-700' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className={actionColor}>{action}</span>{' '}
                    {formatDistanceToNow(new Date(participant.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </CardContent>
  );
}