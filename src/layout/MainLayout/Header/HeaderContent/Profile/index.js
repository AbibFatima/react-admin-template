import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, CardContent, ClickAwayListener, Grid, IconButton, Paper, Popper, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { LogoutOutlined } from '@ant-design/icons';

import secureLocalStorage from 'react-secure-storage';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
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
        setUserInfo({ firstname: '', role: '' });
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

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';

  const [userInfo, setUserInfo] = useState({ firstname: '', role: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = secureLocalStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUserInfo({ firstname: data.firstname, role: data.role });
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar>{userInfo.firstname.charAt(0).toUpperCase()}</Avatar>
          <Typography variant="subtitle1">
            {typeof userInfo.firstname === 'string'
              ? userInfo.firstname.charAt(0).toUpperCase() + userInfo.firstname.slice(1)
              : userInfo.firstname}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar>{userInfo.firstname.charAt(0).toUpperCase()}</Avatar>
                            <Stack>
                              <Typography variant="h6">
                                {typeof userInfo.firstname === 'string'
                                  ? userInfo.firstname.charAt(0).toUpperCase() + userInfo.firstname.slice(1)
                                  : userInfo.firstname}
                              </Typography>
                              <Typography variant="subtitle1">{userInfo.role}</Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
