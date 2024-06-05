import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button
} from '@mui/material';
import Papa from 'papaparse';
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'success';
      title = 'No Churn';
      break;
    case 1:
      color = 'primary';
      title = 'Churn';
      break;
    default:
      color = 'warning';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function ChurnersTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('//localhost:5000/dashboard/tabledata');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'churners_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h6" color="textSecondary">
          {' '}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Télécharger CSV
        </Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            sx={{
              '& .MuiTableCell-root:first-of-type': {
                pl: 2
              },
              '& .MuiTableCell-root:last-of-type': {
                pr: 3
              }
            }}
          >
            <OrderTableHead />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={index}>
                  <TableCell component="th" scope="row" align="left">
                    <Link color="secondary">{row.id_client}</Link>
                  </TableCell>
                  <TableCell align="left">{row.phone_number}</TableCell>
                  <TableCell align="left">{row.seg_tenure}</TableCell>
                  <TableCell align="left">{row.value_segment}</TableCell>
                  <TableCell align="left">{row.tariff_profile}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.pred_flag} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

// OrderTableHead component
const headCells = [
  {
    id: 'id_client',
    align: 'left',
    disablePadding: false,
    label: 'Identifiant du client'
  },
  {
    id: 'phone_number',
    align: 'left',
    disablePadding: true,
    label: 'N° de téléphone'
  },
  {
    id: 'seg_tenure',
    align: 'left',
    disablePadding: false,
    label: 'Segment Tenure'
  },
  {
    id: 'value_segment',
    align: 'left',
    disablePadding: false,
    label: 'Value Segment'
  },
  {
    id: 'tariff_profile',
    align: 'left',
    disablePadding: false,
    label: 'Tariff Profile'
  },
  {
    id: 'pred_flag',
    align: 'left',
    disablePadding: false,
    label: 'Flag prédit'
  }
];

function OrderTableHead() {
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
}
