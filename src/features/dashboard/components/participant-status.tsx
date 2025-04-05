'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiClient } from '@/config/axios';

// Tipos basados en la respuesta del backend
interface Participant {
  id: number;
  isActive: boolean;
  gender: 'M' | 'F' | 'O';
  hdm: boolean;
  adhc: boolean;
  cmID: number;
  community: string;
  caregivers: { participantId: number; caregiverId: number; assignedAt: string; assignedBy: string; caregiver: { id: number; name: string } }[];
  name: string;
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

// Tipo para las claves de género
type GenderKey = 'Male' | 'Female' | 'Other';

const fetchParticipants = async (): Promise<ParticipantsResponse> => {
  const params = {
    page: 1,
    pageSize: 1000,
  };
  const response = await apiClient.get('/participants', { params });
  return response.data;
};

export function ParticipantStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['participant-status'],
    queryFn: fetchParticipants,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardHeader>
            <CardContent className="h-72 bg-gray-200 dark:bg-gray-700 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const participantsData = data || {
    data: [],
    total: 0,
    page: 1,
    pageSize: 1000,
    totalPages: 1,
    hasNext: false,
    filterCounts: { isActive: { true: 0, false: 0 }, gender: { M: 0, F: 0, O: 0 } },
  };
  const participants = participantsData.data;

  // Datos y configuración para el gráfico de género
  const genderData: { name: GenderKey; value: number }[] = [
    { name: 'Male', value: participantsData.filterCounts.gender.M },
    { name: 'Female', value: participantsData.filterCounts.gender.F },
    { name: 'Other', value: participantsData.filterCounts.gender.O },
  ];
  const genderConfig: Record<GenderKey, { label: string; color: string }> = {
    Male: { label: 'Male', color: '#2563eb' }, // Azul oscuro
    Female: { label: 'Female', color: '#60a5fa' }, // Azul claro
    Other: { label: 'Other', color: '#93c5fd' }, // Azul más claro
  };

  // Datos y configuración para servicios
  const serviceData = [
    { service: 'HDM', participants: participants.filter((p) => p.hdm).length },
    { service: 'ADHC', participants: participants.filter((p) => p.adhc).length },
  ];
  const serviceConfig = {
    participants: {
      label: 'Participants',
      color: '#2563eb', // Azul oscuro
    },
  };

  // Datos y configuración para comunidades (top 5)
  const communityCounts = participants.reduce((acc, p) => {
    acc[p.community] = (acc[p.community] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const communityData = Object.entries(communityCounts)
    .map(([name, value]) => ({ community: name, participants: value }))
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);
  const communityConfig = {
    participants: {
      label: 'Participants',
      color: '#14B8A6', // Turquesa
    },
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Género */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={genderConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
                animationDuration={800}
              >
                {genderData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={genderConfig[entry.name].color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Service Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={serviceConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={serviceData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="service"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 'auto']} // Ajusta el eje Y automáticamente
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="participants"
                fill={serviceConfig.participants.color}
                radius={4}
                animationDuration={800}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Comunidades */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Communities</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={communityConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={communityData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="community"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 5)} // Abreviar nombres largos
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 'auto']} // Ajusta el eje Y automáticamente
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="participants"
                fill={communityConfig.participants.color}
                radius={4}
                animationDuration={800}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}