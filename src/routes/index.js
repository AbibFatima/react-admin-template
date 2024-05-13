import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import NotFound from 'pages/extra-pages/NotFound';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, MainRoutes, { path: '*', element: <NotFound /> }]);
}
