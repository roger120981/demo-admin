'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock } from 'lucide-react';
import { apiClient } from '@/config/axios';
import { Header } from '@/components/layout/header';
import { TopNav } from '@/components/layout/top-nav';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';

// Definimos topNav ajustado para caregivers
const topNav = [
  { title: 'Overview', href: '/caregivers', isActive: true, disabled: false },
  { title: 'Workload', href: '/dashboard/workload', isActive: false, disabled: false },
  { title: 'Status', href: '/dashboard/status', isActive: false, disabled: false },
  { title: 'Trends', href: '/dashboard/trends', isActive: false, disabled: false },
];

// Tipo para los datos del caregiver
interface CaregiverDetails {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchCaregiverDetails = async (id: string): Promise<CaregiverDetails> => {
  const response = await apiClient.get(`/caregivers/${id}`);
  return response.data;
};

export function CaregiversDetails() {
  const { id } = useParams({ strict: false }); // id puede ser string | undefined

  const { data: caregiver, isLoading, error } = useQuery({
    queryKey: ['caregiver', id],
    queryFn: () => fetchCaregiverDetails(id!),
    enabled: !!id,
  });

  // Manejo del caso en que id sea undefined
  if (!id) {
    return (
      <div className="p-4">
        <p className="text-red-600">Caregiver ID not found.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error loading caregiver details: {error.message}</p>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="p-4">
        <p className="text-red-600">Caregiver not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Contenido principal */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Encabezado con botón de regreso y acciones */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link to="/caregivers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Caregivers
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{caregiver.name || 'Unknown Caregiver'}</h1>
          </div>
        </div>

        {/* Cuadrícula principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Información del Caregiver */}
          <Card className="col-span-1 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Caregiver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Details</h3>
                <dl className="grid grid-cols-1 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">ID</dt>
                    <dd className="text-sm font-semibold">{caregiver.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Name</dt>
                    <dd className="text-sm">{caregiver.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Email</dt>
                    <dd className="text-sm">{caregiver.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Phone</dt>
                    <dd className="text-sm">{caregiver.phone || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Active</dt>
                    <dd className="text-sm">{caregiver.isActive ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Historial */}
          <Card className="col-span-1 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Created At</dt>
                  <dd className="text-sm">{new Date(caregiver.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Updated At</dt>
                  <dd className="text-sm">{new Date(caregiver.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}