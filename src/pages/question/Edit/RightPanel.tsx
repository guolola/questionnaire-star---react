import { Tabs } from 'antd';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import ComponentProp from './ComponentProp';
import PageSetting from './pageSetting/index';
import { useEffect, useState } from 'react';
import useGetComponentInfo from '../../../hooks/useGetComponentInfo';

enum TAB_KEYS {
  prop = 'prop',
  pageSetting = 'pageSetting',
}
const RightPanel = () => {
  const [activeKey, setActiveKey] = useState(TAB_KEYS.prop);
  const { selectedId } = useGetComponentInfo();
  useEffect(() => {
    if (selectedId) {
      setActiveKey(TAB_KEYS.prop);
    }
    setActiveKey(selectedId ? TAB_KEYS.prop : TAB_KEYS.pageSetting);
  }, [selectedId]);
  const tabsItems = [
    {
      key: TAB_KEYS.prop,
      label: (
        <span>
          <FileTextOutlined></FileTextOutlined>
          属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: TAB_KEYS.pageSetting,
      label: (
        <span>
          <SettingOutlined></SettingOutlined>
          页面设置
        </span>
      ),
      children: <PageSetting />,
    },
  ];
  return <Tabs activeKey={activeKey} items={tabsItems} />;
};

export default RightPanel;
