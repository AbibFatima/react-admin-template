import { useTheme } from '@mui/material/styles';
// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';

import secureLocalStorage from 'react-secure-storage';
// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();

  const handleLogout = async () => {
    const token = secureLocalStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await fetch('//localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        alert('Error logging out !');
      } else {
        secureLocalStorage.removeItem('token');
        secureLocalStorage.removeItem('name');
        secureLocalStorage.removeItem('admin');
        secureLocalStorage.removeItem('specialist');
        secureLocalStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SimpleBar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Navigation />
      </Box>
      <List sx={{ mt: 'auto' }}>
        <Box sx={{ mb: 1 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                borderRight: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                '&:hover': {
                  color: theme.palette.primary.main,
                  bgcolor: 'primary.lighter'
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 28,
                color: 'text.primary',
                ...{
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'secondary.lighter'
                  }
                }
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  Déconnecter
                </Typography>
              }
            />
          </ListItemButton>
        </Box>
      </List>
    </SimpleBar>
  );
};

export default DrawerContent;
