// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  FundOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  BarChartOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  FundOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-prediction',
      title: 'Prediction',
      type: 'item',
      url: '/prediction',
      icon: icons.FundOutlined
    },
    {
      id: 'util-uplify',
      title: 'Uplift',
      type: 'item',
      url: '/uplift',
      icon: icons.BarChartOutlined
    }
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.BgColorsOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/shadow',
    //   icon: icons.BarcodeOutlined
    // },
    // {
    //   id: 'ant-icons',
    //   title: 'Ant Icons',
    //   type: 'item',
    //   url: '/icons/ant',
    //   icon: icons.AntDesignOutlined,
    //   breadcrumbs: false
    // }
  ]
};

export default utilities;
