import { IconUserPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useCaregiversContext } from '../context/caregivers-context';

export function CaregiversPrimaryButtons() {
  const { setOpen } = useCaregiversContext();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Caregiver</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  );
}