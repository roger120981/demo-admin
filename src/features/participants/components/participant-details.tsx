'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, Phone, MapPin, Activity, Clock, Users } from 'lucide-react';
import { apiClient } from '@/config/axios';
import { Header } from '@/components/layout/header';
import { TopNav } from '@/components/layout/top-nav';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';

// Definimos topNav igual que en index.tsx
const topNav = [
  { title: 'Overview', href: '/', isActive: true, disabled: false },
  { title: 'Workload', href: '/dashboard/workload', isActive: false, disabled: false },
  { title: 'POC Status', href: '/dashboard/poc-status', isActive: false, disabled: false },
  { title: 'Trends', href: '/dashboard/trends', isActive: false, disabled: false },
];

// Tipo para los datos del participante (ajustado según la respuesta del backend)
interface Participant {
  id: number;
  name: string;
  gender: 'M' | 'F' | 'O';
  medicaidId: string;
  dob: string;
  location: string;
  community: string;
  address: string;
  primaryPhone: string;
  secondaryPhone: string;
  isActive: boolean;
  locStartDate: string;
  locEndDate: string;
  pocStartDate: string;
  pocEndDate: string;
  units: number;
  hours: number;
  hdm: boolean;
  adhc: boolean;
  cmID: number;
  createdAt: string;
  updatedAt: string;
  caregivers: { participantId: number; caregiverId: number; assignedAt: string; assignedBy: string; caregiver: { id: number; name: string } }[];
}

const fetchParticipantDetails = async (id: string): Promise<Participant> => {
  const response = await apiClient.get(`/participants/${id}`);return response.data;
};

export function ParticipantDetails() {
  const { id } = useParams({ strict: false }); // id puede ser string | undefined

  // Llamamos useQuery incondicionalmente
  const { data: participant, isLoading, error } = useQuery({
    queryKey: ['participant', id],
    queryFn: () => fetchParticipantDetails(id!),
    enabled: !!id, // Solo ejecuta la consulta si id está definido
  });

  // Manejo del caso en que id sea undefined
  if (!id) {
    return (
      <div className="p-4">
        <p className="text-red-600">Participant ID not found.</p>
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
        <p className="text-red-600">Error loading participant details: {error.message}</p>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="p-4">
        <p className="text-red-600">Participant not found.</p>
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
            <Link to="/participants">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Participants
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{participant.name || 'Unknown Participant'}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={participant.isActive ? 'default' : 'destructive'} className="text-sm px-3 py-1">
              {participant.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Cuadrícula principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Información Personal y de Contacto */}
          <Card className="col-span-1 lg:col-span-2 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Participant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Personal Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">ID</dt>
                    <dd className="text-sm font-semibold">{participant.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Gender</dt>
                    <dd className="text-sm">{participant.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Medicaid ID</dt>
                    <dd className="text-sm">{participant.medicaidId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Date of Birth</dt>
                    <dd className="text-sm">{new Date(participant.dob).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <Separator className="my-2" />

              {/* Información de Contacto */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  Contact Information
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Location</dt>
                    <dd className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {participant.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Community</dt>
                    <dd className="text-sm">{participant.community}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Address</dt>
                    <dd className="text-sm">{participant.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Primary Phone</dt>
                    <dd className="text-sm">{participant.primaryPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground/80">Secondary Phone</dt>
                    <dd className="text-sm">{participant.secondaryPhone || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Estado y Servicios */}
          <Card className="col-span-1 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Status and Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Status</dt>
                  <dd>
                    <Badge variant={participant.isActive ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                      {participant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Case Manager ID</dt>
                  <dd className="text-sm font-semibold">{participant.cmID}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">HDM</dt>
                  <dd className="text-sm">{participant.hdm ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">ADHC</dt>
                  <dd className="text-sm">{participant.adhc ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Units</dt>
                  <dd className="text-sm">{participant.units}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Hours</dt>
                  <dd className="text-sm">{participant.hours}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Cuidadores */}
          <Card className="col-span-1 lg:col-span-2 shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Caregivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participant.caregivers?.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Assigned At</TableHead>
                        <TableHead className="text-muted-foreground">Assigned By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participant.caregivers.map((caregiver, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{caregiver.caregiver.name}</TableCell>
                          <TableCell>{new Date(caregiver.assignedAt).toLocaleString()}</TableCell>
                          <TableCell>{caregiver.assignedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No caregivers assigned.</p>
              )}
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
                  <dd className="text-sm">{new Date(participant.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground/80">Updated At</dt>
                  <dd className="text-sm">{new Date(participant.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}