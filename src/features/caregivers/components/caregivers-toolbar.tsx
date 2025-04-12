import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaregiversFacetedFilter } from './caregivers-faceted-filters';
import { CaregiversViewOptions } from './caregivers-view-options';
import { useCaregiversStore } from '../stores/caregivers-store';
import { useCallback } from 'react';

interface CaregiversToolbarProps<TData> {
  table: Table<TData>;
}

export function CaregiversToolbar<TData>({ table }: CaregiversToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleReset = useCallback(() => {
    table.resetColumnFilters();
    table.setColumnFilters([]);
    useCaregiversStore.getState().reset();
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
            <CaregiversFacetedFilter
              column={table.getColumn('name')}
              title="Name"
              options={[]} // Debes proporcionar opciones para 'name' si las tienes
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
      <CaregiversViewOptions table={table} />
    </div>
  );
}