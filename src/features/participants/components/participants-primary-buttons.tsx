import { IconUserPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useParticipantsContext } from '../context/participants-context';

export function ParticipantsPrimaryButtons() {
  const { setOpen } = useParticipantsContext();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Participant</span>
        <IconUserPlus size={18} />
      </Button>
    </div>
  );
}