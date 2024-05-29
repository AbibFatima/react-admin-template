import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const [, setLogoutError] = useState('');

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setLogoutError('');
        window.location.href = '/login';
      } else {
        alert('Error logging out!');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out!');
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
                  Log out
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
