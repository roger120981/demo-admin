import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/case-managers-columns';
import { CaseManagersDialogs } from './components/case-managers-dialogs';
import { CaseManagersPrimaryButtons } from './components/case-managers-primary-buttons';
import { CaseManagersTable } from './components/case-managers-table';
import CaseManagersProvider from './context/case-managers-provider';
import { useCaseManagers } from './api/case-managers-api';

export default function CaseManagers() {
  const { data, isLoading } = useCaseManagers();

  if (isLoading) return <div>Loading...</div>;

  return (
    <CaseManagersProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Case Manager List</h2>
            <p className="text-muted-foreground">
              Manage your case managers here.
            </p>
          </div>
          <CaseManagersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <CaseManagersTable
            key={`${data?.page}-${data?.pageSize}`}
            data={data?.data || []}
            totalPages={data?.totalPages || 1}
            columns={columns}
          />
        </div>
      </Main>

      <CaseManagersDialogs />
    </CaseManagersProvider>
  );
}