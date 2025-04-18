'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { TopNav } from '@/components/layout/top-nav';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ParticipantsSummary } from './components/participants-summary';
import { ParticipantStatus } from './components/participant-status';
import { RecentActivity } from './components/recent-activities'; // Importamos el nuevo componente

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button>Download Reports</Button>
          </div>
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workload">Workload</TabsTrigger>
              <TabsTrigger value="poc-status">POC Status</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <ParticipantsSummary />
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Participant Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ParticipantStatus />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Last updated participants</CardDescription>
                </CardHeader>
                <RecentActivity /> {/* Añadimos RecentActivity aquí */}
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="workload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Manager Workload</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Contenido de Case Manager Workload */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="poc-status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POC Status</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Contenido de POC Status */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Participants Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Contenido de New Participants Trend */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}

const topNav = [
  { title: 'Overview', href: '/dashboard/overview', isActive: true, disabled: false },
  { title: 'Workload', href: '/dashboard/workload', isActive: false, disabled: false },
  { title: 'POC Status', href: '/dashboard/poc-status', isActive: false, disabled: false },
  { title: 'Trends', href: '/dashboard/trends', isActive: false, disabled: false },
];