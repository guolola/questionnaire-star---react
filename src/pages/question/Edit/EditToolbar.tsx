import { Button, Space, Tooltip } from 'antd';
import {
  BlockOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  BranchesOutlined,
  BgColorsOutlined,
  BarChartOutlined,
  ApiOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  changeComponentHidden,
  copyComponent,
  pasteComponent,
  removeSelectedComponent,
  toggleComponentLock,
} from '../../../store/componentsReducer';
import useGetComponentInfo from '../../../hooks/useGetComponentInfo';
import { useState } from 'react';
import AdvancedFeaturesManager from '../../../components/AdvancedFeaturesManager';

const EditToolbar = () => {
  const dispatch = useDispatch();
  const { selectedId, selectedComponent, copiedComponent, componentList } = useGetComponentInfo();
  const { isLocked } = selectedComponent || {};
  
  // 高级功能管理器状态
  const [advancedFeaturesVisible, setAdvancedFeaturesVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string>('overview');
  
  // 删除组件
  function handleDelete() {
    dispatch(removeSelectedComponent());
  }
  // 隐藏组件
  function handleHidden() {
    dispatch(changeComponentHidden({ fe_id: selectedId, isHidden: true }));
  }
  // 锁定组件
  function handleLock() {
    dispatch(toggleComponentLock({ fe_id: selectedId, isLocked: true }));
  }
  // 复制组件
  function handleCopy() {
    dispatch(copyComponent());
  }
  // 粘贴组件
  function handlePaste() {
    dispatch(pasteComponent());
  }
  
  // 高级功能处理函数
  function handleLogicBranching() {
    setActiveFeature('logic-branching');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleCustomStyling() {
    setActiveFeature('custom-styling');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleAdvancedAnalytics() {
    setActiveFeature('analytics');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleAPIIntegration() {
    setActiveFeature('api');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleMultiPage() {
    setActiveFeature('multi-page');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleValidation() {
    setActiveFeature('validation-rules');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleConditionalLogic() {
    setActiveFeature('conditional-logic');
    setAdvancedFeaturesVisible(true);
  }
  
  function handleAdvancedFeatures() {
    setActiveFeature('overview');
    setAdvancedFeaturesVisible(true);
  }
  
  // 生成问题列表给高级功能使用
  const questions = componentList.map(component => ({
    id: component.fe_id,
    title: component.props?.title || component.type,
    type: component.type
  }));
  return (
    <Space>
      {/* 基础工具 */}
      <Tooltip title="删除">
        <Button shape="circle" icon={<DeleteOutlined />} onClick={handleDelete}></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button shape="circle" icon={<EyeInvisibleOutlined />} onClick={handleHidden}></Button>
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={handleLock}
          type={isLocked ? 'primary' : 'default'}
        ></Button>
      </Tooltip>
      <Tooltip title="复制">
        <Button shape="circle" icon={<CopyOutlined />} onClick={handleCopy}></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={handlePaste}
          disabled={!copiedComponent}
        ></Button>
      </Tooltip>
      
      {/* 分割线 */}
      <div style={{ height: '24px', width: '1px', backgroundColor: '#d9d9d9', margin: '0 8px' }} />
      
      {/* Phase 3 高级功能 */}
      <Tooltip title="条件逻辑">
        <Button shape="circle" icon={<BranchesOutlined />} onClick={handleConditionalLogic}></Button>
      </Tooltip>
      <Tooltip title="多页面设置">
        <Button shape="circle" icon={<FileTextOutlined />} onClick={handleMultiPage}></Button>
      </Tooltip>
      <Tooltip title="验证规则">
        <Button shape="circle" icon={<CheckCircleOutlined />} onClick={handleValidation}></Button>
      </Tooltip>
      
      {/* 分割线 */}
      <div style={{ height: '24px', width: '1px', backgroundColor: '#d9d9d9', margin: '0 8px' }} />
      
      {/* Phase 5 企业级功能 */}
      <Tooltip title="高级逻辑分支">
        <Button shape="circle" icon={<SettingOutlined />} onClick={handleLogicBranching}></Button>
      </Tooltip>
      <Tooltip title="自定义样式">
        <Button shape="circle" icon={<BgColorsOutlined />} onClick={handleCustomStyling}></Button>
      </Tooltip>
      <Tooltip title="高级分析">
        <Button shape="circle" icon={<BarChartOutlined />} onClick={handleAdvancedAnalytics}></Button>
      </Tooltip>
      <Tooltip title="API集成">
        <Button shape="circle" icon={<ApiOutlined />} onClick={handleAPIIntegration}></Button>
      </Tooltip>
      
      {/* 分割线 */}
      <div style={{ height: '24px', width: '1px', backgroundColor: '#d9d9d9', margin: '0 8px' }} />
      
      {/* 高级功能管理中心 */}
      <Tooltip title="高级功能中心">
        <Button 
          shape="circle" 
          icon={<ThunderboltOutlined />} 
          onClick={handleAdvancedFeatures}
          type="primary"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderColor: '#667eea' }}
        ></Button>
      </Tooltip>
      
      {/* 高级功能管理器 */}
      <AdvancedFeaturesManager
        visible={advancedFeaturesVisible}
        onClose={() => setAdvancedFeaturesVisible(false)}
        activeFeature={activeFeature}
        questions={questions}
        currentQuestionId={selectedId}
      />
    </Space>
  );
};

export default EditToolbar;
