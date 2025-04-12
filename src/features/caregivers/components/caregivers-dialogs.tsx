import { useCaregiversContext } from '../context/caregivers-context';
import { CaregiversActionDialog } from './caregivers-action-dialog';
import { CaregiversDeleteDialog } from './caregivers-delete-dialog';

export function CaregiversDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCaregiversContext();
  return (
    <>
      <CaregiversActionDialog
        key="caregiver-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <CaregiversActionDialog
            key={`caregiver-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <CaregiversDeleteDialog
            key={`caregiver-delete-${currentRow.id}`}
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