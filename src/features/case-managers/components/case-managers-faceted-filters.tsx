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
import { useCaseManagersStore } from '../stores/case-managers-store';

interface CaseManagersFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: { label: string; value: string }[];
  filterKey?: string;
}

export function CaseManagersFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  filterKey,
}: CaseManagersFacetedFilterProps<TData, TValue>) {
  const { filters, setFilters } = useCaseManagersStore();
  const columnId = filterKey || column?.id;
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
    // Solo actualizamos la columna si no hay filterKey definido
    if (!filterKey) {
      column?.setFilterValue(filterValue); // Actualiza TanStack Table
    }
    if (columnId) {
      setFilters({ [columnId]: filterValue }); // Actualiza Zustand
    }
    setSelectedValues(new Set(newValues));
  };

  const handleClearFilters = () => {
    if (!filterKey) {
      column?.setFilterValue(undefined);
    }
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
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
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
                const optionValueStr = option.value;
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