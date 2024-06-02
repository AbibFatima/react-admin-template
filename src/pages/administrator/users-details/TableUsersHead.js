import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const headCells = [
  {
    id: 'select',
    disablePadding: true
  },
  {
    id: 'id_user',
    align: 'left',
    disablePadding: false,
    label: 'User ID'
  },
  {
    id: 'firstname',
    align: 'left',
    disablePadding: true,
    label: 'Firstname'
  },
  {
    id: 'lastname',
    align: 'left',
    disablePadding: false,
    label: 'Lastname'
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email'
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role'
  },
  {
    id: 'modif',
    align: 'left',
    disablePadding: false
  },
  {
    id: 'delete',
    align: 'left',
    disablePadding: false
  }
];

const TableUsersHead = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableUsersHead;
