import { IconUserPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAgenciesContext } from '../context/agencies-context';

export function AgenciesPrimaryButtons() {
  const { setOpen } = useAgenciesContext();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Agency</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  );
}