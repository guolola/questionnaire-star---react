import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Logo from '../components/Logo';
import UserInfo from '../components/UserInfo';
import styles from './styles/MainLayout.module.scss';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <UserInfo />{' '}
        </div>
      </Header>
      <Content className={styles.main}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>
        小慕问卷 &copy; 2025
        <a href="https://beian.miit.gov.cn/"> 京ICP备2022000055号-1</a>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
