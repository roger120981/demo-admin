import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaseManagersFacetedFilter } from '@/features/case-managers/components/case-managers-faceted-filters';
import { CaseManagersViewOptions } from './case-managers-view-options';
import { useCaseManagersStore } from '../stores/case-managers-store';
import { useCallback } from 'react';

interface CaseManagersToolbarProps<TData> {
  table: Table<TData>;
}

export function CaseManagersToolbar<TData>({ table }: CaseManagersToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleReset = useCallback(() => {
    table.resetColumnFilters();
    table.setColumnFilters([]);
    useCaseManagersStore.getState().reset();
  }, [table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('name') && (
            <CaseManagersFacetedFilter
              column={table.getColumn('name')}
              title="Name"
              options={[]} // Debes proporcionar las opciones para 'name'
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <CaseManagersViewOptions table={table} />
    </div>
  );
}