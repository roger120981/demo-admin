import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/participants-columns';
import { ParticipantsDialogs } from './components/participants-dialogs';
import { ParticipantsPrimaryButtons } from './components/participants-primary-buttons';
import { ParticipantsTable } from './components/participants-table';
import ParticipantsProvider from './context/participants-provider'; // Cambio aquí
import { useParticipants } from './api/participants-api';

export default function Participants() {
  const { data, isLoading } = useParticipants();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ParticipantsProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Participant List</h2>
            <p className="text-muted-foreground">
              Manage your participants here.
            </p>
          </div>
          <ParticipantsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <ParticipantsTable data={data?.data || []} columns={columns} />
        </div>
      </Main>

      <ParticipantsDialogs />
    </ParticipantsProvider>
  );
}