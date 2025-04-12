'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { useCaseManagersContext } from '@/features/case-managers/context/case-managers-context';
import { CaseManager } from '../data/schema';

interface CaseManagersRowActionsProps {
  row: Row<CaseManager>;
}

export function CaseManagersRowActions({ row }: CaseManagersRowActionsProps) {
  const { setOpen, setCurrentRow } = useCaseManagersContext();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Acción View */}
        <DropdownMenuItem asChild>
          <Link to="/case-managers/$id" params={{ id: row.original.id.toString() }}>
            View
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Acción Edit */}
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('edit');
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Acción Delete */}
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen('delete');
          }}
          className="!text-red-500"
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}