import { useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Agency } from '../data/schema';
import { AgenciesPagination } from './agencies-pagination';
import { AgenciesToolbar } from './agencies-toolbar';
import { useAgenciesStore } from '../stores/agencies-store';
import React from 'react';

interface AgenciesTableProps {
  columns: ColumnDef<Agency>[];
  data: Agency[];
  totalPages: number;
}

export function AgenciesTable({ columns, data, totalPages }: AgenciesTableProps) {
  const { page, pageSize, filters, sort, setPage, setPageSize, setFilters, setSort } = useAgenciesStore();
  
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(sort ? [{ id: sort.id, desc: sort.desc }] : []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize },
    },
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      setSort(newSorting[0] ? { id: newSorting[0].id, desc: newSorting[0].desc } : null);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      // Filtrar solo los filtros con valores válidos
      const activeFilters = newFilters.filter(
        (filter) => filter.value !== undefined && (Array.isArray(filter.value) ? filter.value.length > 0 : true)
      );
      setColumnFilters(activeFilters);
      const filterObj = activeFilters.reduce((acc, filter) => {
        const value = Array.isArray(filter.value) ? filter.value : filter.value !== undefined ? [filter.value] : [];
        if (value.length === 0) {
          return acc;
        }
        if (filter.id === 'name') {
          const nameValue = value[0] === '' ? undefined : value[0];
          acc[filter.id] = nameValue ? [nameValue] : undefined;
        } else {
          acc[filter.id] = value;
        }
        return acc;
      }, {} as Record<string, (string)[] | undefined>);
      setFilters(filterObj);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
      setPage(newPagination.pageIndex + 1);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const initialFilters = Object.entries(filters).map(([id, value]) => ({
      id,
      value: Array.isArray(value) ? value : value !== undefined ? [value] : [],
    })).filter((filter) => filter.value.length > 0); // Solo filtros con valores
    setColumnFilters(initialFilters.length ? initialFilters : []);
  }, [filters]);

  return (
    <div className="space-y-4">
      <AgenciesToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.column.columnDef.meta?.className ?? ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AgenciesPagination table={table} />
    </div>
  );
}