import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/agencies-columns';
import { AgenciesDialogs } from './components/agencies-dialogs';
import { AgenciesPrimaryButtons } from './components/agencies-primary-buttons';
import { AgenciesTable } from './components/agencies-table';
import AgenciesProvider from './context/agencies-provider'; // Cambio aquí
import { useAgencies } from './api/agencies-api';

export default function Agencies() {
  const { data, isLoading } = useAgencies();

  if (isLoading) return <div>Loading...</div>;

  return (
    <AgenciesProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Agency List</h2>
            <p className="text-muted-foreground">
              Manage your agencies here.
            </p>
          </div>
          <AgenciesPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <AgenciesTable
            key={`${data?.page}-${data?.pageSize}`}
            data={data?.data || []}
            totalPages={data?.totalPages || 1}
            columns={columns}
          />
        </div>
      </Main>

      <AgenciesDialogs />
    </AgenciesProvider>
  );
}