import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/caregivers-columns';
import { CaregiversDialogs } from './components/caregivers-dialogs';
import { CaregiversPrimaryButtons } from './components/caregivers-primary-buttons';
import { CaregiversTable } from './components/caregivers-table';
import CaregiversProvider from './context/caregivers-provider';
import { useCaregivers } from './api/caregivers-api';

export default function Caregivers() {
  const { data, isLoading } = useCaregivers();

  if (isLoading) return <div>Loading...</div>;

  return (
    <CaregiversProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Caregiver List</h2>
            <p className="text-muted-foreground">
              Manage your caregivers here.
            </p>
          </div>
          <CaregiversPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <CaregiversTable
            key={`${data?.page}-${data?.pageSize}`}
            data={data?.data || []}
            totalPages={data?.totalPages || 1}
            columns={columns}
          />
        </div>
      </Main>

      <CaregiversDialogs />
    </CaregiversProvider>
  );
}