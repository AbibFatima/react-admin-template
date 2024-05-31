// assets
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
// icons
const icons = {
  PeopleAltOutlinedIcon,
  UploadFileOutlinedIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'group-pages',
  type: 'group',
  title: 'Pages',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: icons.PeopleAltOutlinedIcon,
      breadcrumbs: true
    },
    {
      id: 'UpdateDataset',
      title: 'Update Dataset',
      type: 'item',
      url: '/admin/updateDataset',
      icon: icons.UploadFileOutlinedIcon,
      breadcrumbs: true
    }
  ]
};

export default pages;
