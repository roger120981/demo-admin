import { useAgenciesContext } from '../context/agencies-context';
import { AgenciesActionDialog } from './agencies-action-dialog';
import { AgenciesDeleteDialog } from './agencies-delete-dialog';

export function AgenciesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAgenciesContext();
  return (
    <>
      <AgenciesActionDialog
        key="agency-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <AgenciesActionDialog
            key={`agency-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <AgenciesDeleteDialog
            key={`agency-delete-${currentRow.id}`}
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