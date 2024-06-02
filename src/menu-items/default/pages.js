// assets
import { LogoutOutlined } from '@ant-design/icons';

// icons
const icons = {
  LogoutOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  type: 'group',
  children: [
    {
      id: 'lougout',
      title: 'Log out',
      type: 'item',
      url: '/',
      icon: icons.LogoutOutlined,
      target: true
    }
  ]
};

export default pages;
