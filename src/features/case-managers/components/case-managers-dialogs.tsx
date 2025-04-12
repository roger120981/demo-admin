import { useCaseManagersContext } from '../context/case-managers-context';
import { CaseManagersActionDialog } from './case-managers-action-dialog';
import { CaseManagersDeleteDialog } from './case-managers-delete-dialog';

export function CaseManagersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCaseManagersContext();
  return (
    <>
      <CaseManagersActionDialog
        key="case-manager-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <CaseManagersActionDialog
            key={`case-manager-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <CaseManagersDeleteDialog
            key={`case-manager-delete-${currentRow.id}`}
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