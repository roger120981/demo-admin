import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/utils/utils';
import { Checkbox } from '@/components/ui/checkbox';
import LongText from '@/components/long-text';
import { Agency } from '../data/schema';
import { AgenciesColumnHeader } from './agencies-column-header';
import { AgenciesRowActions } from './agencies-row-actions';

export const columns: ColumnDef<Agency>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <AgenciesColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <AgenciesColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <AgenciesColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('updatedAt')).toLocaleDateString()}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <AgenciesRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];