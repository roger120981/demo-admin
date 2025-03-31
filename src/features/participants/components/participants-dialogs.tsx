import { useParticipantsContext } from '../context/participants-context';
import { ParticipantsActionDialog } from './participants-action-dialog';
import { ParticipantsDeleteDialog } from './participants-delete-dialog';

export function ParticipantsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useParticipantsContext();
  return (
    <>
      <ParticipantsActionDialog
        key="participant-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <ParticipantsActionDialog
            key={`participant-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <ParticipantsDeleteDialog
            key={`participant-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}