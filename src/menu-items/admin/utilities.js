// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  PieChartOutlined,
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
  PieChartOutlined,
  FundOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'util-segment',
      title: 'Segments',
      type: 'item',
      url: '/admin/Segments',
      icon: icons.PieChartOutlined
    },
    {
      id: 'util-prediction',
      title: 'Prédiction',
      type: 'item',
      url: '/admin/prediction',
      icon: icons.FundOutlined
    },
    {
      id: 'util-uplify',
      title: 'Uplift',
      type: 'item',
      url: '/admin/uplift',
      icon: icons.BarChartOutlined
    }
  ]
};

export default utilities;
