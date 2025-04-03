import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { genderOptions, booleanOptions } from '../data/data';
import { ParticipantsFacetedFilter } from './participants-faceted-filter';
import { ParticipantsViewOptions } from './participants-view-options';
import { useParticipantsStore } from '../stores/participants-store';
import { useCallback } from 'react';

interface ParticipantsToolbarProps<TData> {
  table: Table<TData>;
  filterCounts?: {
    isActive: { true: number; false: number };
    gender: { M: number; F: number; O: number };
  };
}

export function ParticipantsToolbar<TData>({ table, filterCounts }: ParticipantsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleReset = useCallback(() => {
    table.resetColumnFilters();
    table.setColumnFilters([]);
    useParticipantsStore.getState().reset();
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
          {table.getColumn('gender') && (
            <ParticipantsFacetedFilter
              column={table.getColumn('gender')}
              title="Gender"
              options={genderOptions}
              filterCounts={filterCounts?.gender}
            />
          )}
          {table.getColumn('isActive') && (
            <ParticipantsFacetedFilter
              column={table.getColumn('isActive')}
              title="Status"
              options={booleanOptions}
              filterCounts={filterCounts?.isActive}
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
      <ParticipantsViewOptions table={table} />
    </div>
  );
}