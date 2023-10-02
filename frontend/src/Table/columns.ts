import { createColumnHelper } from '@tanstack/react-table'
import { TableCell } from './TableCell'
import { Student } from './data'
import { EditCell } from './EditCell'

const columnHelper = createColumnHelper<Student>()

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('title', {
    header: 'title',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('type', {
    header: 'type',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('amount', {
    header: 'amount',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.display({
    id: 'edit',
    cell: EditCell,
  }),
]
