import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/utils/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import LongText from '@/components/long-text';
import { callTypes } from '../data/data';
import { Participant } from '../data/schema';
import { ParticipantsColumnHeader } from './participants-column-header';
import { ParticipantsRowActions } from './participants-row-actions';

export const columns: ColumnDef<Participant>[] = [
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
    enableSorting: false, // No tiene sentido ordenar una columna de selección
    enableHiding: false, // No ocultar esta columna esencial
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Name" />
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
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    accessorKey: 'medicaidId',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Medicaid ID" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue('medicaidId')}</div>
    ),
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive');
      const badgeColor = callTypes.get(isActive);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => <div>{row.getValue('location')}</div>,
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    accessorKey: 'primaryPhone',
    header: ({ column }) => (
      <ParticipantsColumnHeader column={column} title="Primary Phone" />
    ),
    cell: ({ row }) => <div>{row.getValue('primaryPhone')}</div>,
    enableSorting: true, // Habilitar ordenamiento
    enableHiding: true, // Habilitar ocultamiento
  },
  {
    id: 'actions',
    cell: ({ row }) => <ParticipantsRowActions row={row} />,
    enableSorting: false, // No tiene sentido ordenar acciones
    enableHiding: false, // No ocultar acciones
  },
];