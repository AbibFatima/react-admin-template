// material-ui
//import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import Image from '../cool-background.png';
// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(5px)',
        zIndex: -1,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        component="img"
        src={Image}
        alt="background"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </Box>
  );
};

export default AuthBackground;
