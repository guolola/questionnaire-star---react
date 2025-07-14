import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Typography, Space, Spin } from 'antd';
import { StarOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import Logo from '../components/Logo';
import UserInfo from '../components/UserInfo';
import ModernLoading from '../components/ModernLoading';
import styles from './styles/MainLayout.module.scss';

const { Header, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setLoading(true);
    navigate(path);
    // 模拟一个短暂的loading时间
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <Layout className={styles.layout}>
      {/* 动态背景装饰 */}
      <div className={styles.backgroundDecorations}>
        <div className={styles.decoration1}></div>
        <div className={styles.decoration2}></div>
        <div className={styles.decoration3}></div>
        <div className={styles.floatingIcons}>
          <StarOutlined className={styles.floatingIcon1} />
          <HeartOutlined className={styles.floatingIcon2} />
          <GlobalOutlined className={styles.floatingIcon3} />
        </div>
      </div>

      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <Logo />
            <div className={styles.tagline}>
              <Text className={styles.taglineText}>专业问卷调查平台</Text>
            </div>
          </div>
          
          <nav className={styles.navigation}>
            <Space size="large">
              <Link to="/" className={styles.navLink}>首页</Link>
              <a 
                onClick={() => handleNavigation('/manage/list')} 
                className={styles.navLink}
                style={{ cursor: 'pointer' }}
              >
                我的问卷
              </a>
              <Link to="/about" className={styles.navLink}>关于我们</Link>
              <Link to="/help" className={styles.navLink}>帮助中心</Link>
            </Space>
          </nav>
          
          <div className={styles.right}>
            <UserInfo />
          </div>
        </div>
      </Header>

      <Content className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent} style={{ position: 'relative' }}>
            {loading && (
              <ModernLoading 
                visible={loading}
                text="正在跳转到我的问卷..."
                type="dots"
              />
            )}
            <Outlet />
          </div>
        </div>
      </Content>

    </Layout>
  );
};

export default MainLayout;
