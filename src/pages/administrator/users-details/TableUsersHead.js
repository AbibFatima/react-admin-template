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
    label: "Identifiant de l'utilisateur"
  },
  {
    id: 'firstname',
    align: 'left',
    disablePadding: true,
    label: 'Prénom'
  },
  {
    id: 'lastname',
    align: 'left',
    disablePadding: false,
    label: 'Nom de famille'
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'E-mail'
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Rôle'
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
