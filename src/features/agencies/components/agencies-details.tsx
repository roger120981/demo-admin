'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Clock } from 'lucide-react';
import { apiClient } from '@/config/axios';
import { Header } from '@/components/layout/header';
import { TopNav } from '@/components/layout/top-nav';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';

// Definimos topNav igual que en el original, ajustado para agencies
const topNav = [
  { title: 'Overview', href: '/agencies', isActive: true, disabled: false },
  { title: 'Workload', href: '/dashboard/workload', isActive: false, disabled: false },
  { title: 'Status', href: '/dashboard/status', isActive: false, disabled: false },
  { title: 'Trends', href: '/dashboard/trends', isActive: false, disabled: false },
];

// Tipo para los datos de la agencia (ajustado según el schema)
interface AgencyDetails {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const fetchAgencyDetails = async (id: string): Promise<AgencyDetails> => {
  const response = await apiClient.get(`/agencies/${id}`);
  return response.data;
};

export function AgenciesDetails() {
  const { id } = useParams({ strict: false }); // id puede ser string | undefined

  const { data: agency, isLoading, error } = useQuery({
    queryKey: ['agency', id],
    queryFn: () => fetchAgencyDetails(id!),
    enabled: !!id, // Solo ejecuta la consulta si id está definido
  });

  // Manejo del caso en que id sea undefined
  if (!id) {
    return (
      <div className="p-4">
        <p className="text-red-600">Agency ID not found.</p>
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
        <p className="text-red-600">Error loading agency details: {error.message}</p>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="p-4">
        <p className="text-red-600">Agency not found.</p>
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
            <Link to="/agencies">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agencies
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{agency.name || 'Unknown Agency'}</h1>
          </div>
        </div>

        {/* Cuadrícula principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Información de la Agencia */}
          <Card className="col-span-1 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Agency Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Details</h3>
                <dl className="grid grid-cols-1 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">ID</dt>
                    <dd className="text-sm font-semibold">{agency.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Name</dt>
                    <dd className="text-sm">{agency.name}</dd>
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
                  <dd className="text-sm">{new Date(agency.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Updated At</dt>
                  <dd className="text-sm">{new Date(agency.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}