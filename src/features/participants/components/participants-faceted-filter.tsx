import { useState, useEffect } from 'react';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { cn } from '@/utils/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useParticipantsStore } from '../stores/participants-store';

interface ParticipantsFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: { label: string; value: string | boolean }[];
  filterCounts?: Record<string, number>;
}

export function ParticipantsFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  filterCounts,
}: ParticipantsFacetedFilterProps<TData, TValue>) {
  const { filters, setFilters } = useParticipantsStore();
  const columnId = column?.id;
  const [selectedValues, setSelectedValues] = useState<Set<string>>(
    new Set((column?.getFilterValue() as string[]) || [])
  );

  // Sincronizar con el filtro de la columna y Zustand
  useEffect(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined;
    const zustandFilter = filters[columnId || ''] as string[] | undefined;
    const currentValue = filterValue || zustandFilter || [];
    setSelectedValues(new Set(currentValue));
  }, [column, columnId, filters]);

  const handleFilterChange = (newValues: string[]) => {
    const filterValue = newValues.length ? newValues : undefined;
    column?.setFilterValue(filterValue); // Actualiza TanStack Table (dispara onColumnFiltersChange)
    if (columnId) {
      setFilters({ [columnId]: filterValue }); // Actualiza Zustand
    }
    setSelectedValues(new Set(newValues));
  };

  const handleClearFilters = () => {
    column?.setFilterValue(undefined);
    if (columnId) {
      setFilters({ [columnId]: undefined });
    }
    setSelectedValues(new Set());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(String(option.value)))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={String(option.value)}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValueStr = String(option.value);
                const isSelected = selectedValues.has(optionValueStr);
                return (
                  <CommandItem
                    key={optionValueStr}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues);
                      if (isSelected) {
                        newSelectedValues.delete(optionValueStr);
                      } else {
                        newSelectedValues.add(optionValueStr);
                      }
                      const filterValues = Array.from(newSelectedValues);
                      handleFilterChange(filterValues);
                    }}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.label}</span>
                    {filterCounts && filterCounts[optionValueStr] !== undefined && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {filterCounts[optionValueStr]}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}