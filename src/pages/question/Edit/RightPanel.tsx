import { Tabs } from 'antd';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import ComponentProp from './ComponentProp';
const RightPanel = () => {
  const tabsItems = [
    {
      key: 'prop',
      label: (
        <span>
          <FileTextOutlined></FileTextOutlined>
          属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: 'setting',
      label: (
        <span>
          <SettingOutlined></SettingOutlined>
          页面设置
        </span>
      ),
      children: <div>页面设置</div>,
    },
  ];
  return <Tabs defaultActiveKey="prop" items={tabsItems} />;
};

export default RightPanel;
