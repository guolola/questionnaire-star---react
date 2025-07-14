import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, Space, Card, Typography, Badge, Tooltip, Spin } from 'antd';
import { 
  PlusOutlined, 
  BarsOutlined, 
  StarOutlined, 
  DeleteOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { createQuestionService } from '../services/question';
import styles from './styles/ManageLayout.module.scss';

const { Text, Title } = Typography;

const ManageLayout = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [navLoading, setNavLoading] = useState(false);
  
  const handleNavigation = (path: string) => {
    setNavLoading(true);
    nav(path);
    setTimeout(() => {
      setNavLoading(false);
    }, 300);
  };
  
  const {
    loading,
    run: handleCreateClick,
  } = useRequest(createQuestionService, {
    manual: true,
    onSuccess(result) {
      nav(`/question/edit/${result.id}`);
    },
  });

  const menuItems = [
    {
      key: '/manage/list',
      icon: <BarsOutlined />,
      label: '我的问卷',
      count: 12,
      color: '#1890ff'
    },
    {
      key: '/manage/star',
      icon: <StarOutlined />,
      label: '星标问卷',
      count: 3,
      color: '#faad14'
    },
    {
      key: '/manage/trash',
      icon: <DeleteOutlined />,
      label: '回收站',
      count: 2,
      color: '#ff4d4f'
    }
  ];

  const quickActions = [
    {
      icon: <FileTextOutlined />,
      label: '快速模板',
      action: () => nav('/templates')
    },
    {
      icon: <BarChartOutlined />,
      label: '数据分析',
      action: () => nav('/analytics')
    },
    {
      icon: <TeamOutlined />,
      label: '团队协作',
      action: () => nav('/team')
    },
    {
      icon: <SettingOutlined />,
      label: '系统设置',
      action: () => nav('/settings')
    }
  ];

  return (
    <div className={styles.container}>
      {/* 动态背景 */}
      <div className={styles.backgroundEffect}>
        <div className={styles.particle1}></div>
        <div className={styles.particle2}></div>
        <div className={styles.particle3}></div>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          {/* 用户信息卡片 */}
          <Card className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <img src="https://api.dicebear.com/7.x/avatars/svg?seed=questionnaire" alt="avatar" />
              </div>
              <div className={styles.userDetails}>
                <Title level={5}>问卷设计师</Title>
                <Text type="secondary">高级用户</Text>
              </div>
            </div>
          </Card>

          {/* 新建问卷按钮 */}
          <Button
            type="primary"
            size="large"
            icon={loading ? <Spin size="small" /> : <PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading}
            className={styles.createButton}
            block
          >
            {loading ? '创建中...' : '新建问卷'}
          </Button>

          {/* 主导航菜单 */}
          <div className={styles.navigation}>
            <Title level={5} className={styles.navTitle}>问卷管理</Title>
            <Space direction="vertical" size="small" className={styles.navItems}>
              {menuItems.map(item => (
                <Button
                  key={item.key}
                  type={pathname.startsWith(item.key) ? 'primary' : 'text'}
                  size="large"
                  icon={item.icon}
                  onClick={() => handleNavigation(item.key)}
                  loading={navLoading}
                  className={`${styles.navButton} ${pathname.startsWith(item.key) ? styles.active : ''}`}
                  block
                >
                  <span className={styles.navLabel}>{item.label}</span>
                  <Badge 
                    count={item.count} 
                    style={{ backgroundColor: item.color }}
                    className={styles.navBadge}
                  />
                </Button>
              ))}
            </Space>
          </div>

          {/* 快捷操作 */}
          <div className={styles.quickActions}>
            <Title level={5} className={styles.navTitle}>快捷操作</Title>
            <div className={styles.actionGrid}>
              {quickActions.map((action, index) => (
                <Tooltip key={index} title={action.label}>
                  <Button
                    type="text"
                    icon={action.icon}
                    onClick={action.action}
                    className={styles.actionButton}
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <Card className={styles.statsCard} size="small">
            <div className={styles.statsContent}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>128</div>
                <div className={styles.statLabel}>总问卷</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1.2k</div>
                <div className={styles.statLabel}>总回答</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>85%</div>
                <div className={styles.statLabel}>完成率</div>
              </div>
            </div>
          </Card>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManageLayout;
