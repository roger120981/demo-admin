import { IconUserPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useCaseManagersContext } from '../context/case-managers-context';

export function CaseManagersPrimaryButtons() {
  const { setOpen } = useCaseManagersContext();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Case Manager</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  );
}