import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { MANAGE_INDEX_PATHNAME } from '../router';
import styles from './styles/Home.module.scss';

const { Title, Paragraph } = Typography;
const Home = () => {
  const nav = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Title>问卷调查 | 在线问卷</Title>
        <Paragraph>已累计创建问卷 100 份，已累计发布问卷 100 份，收到答卷 100 份。</Paragraph>
      </div>
      <div>
        <Button
          type="primary"
          onClick={() => {
            nav(MANAGE_INDEX_PATHNAME);
          }}
        >
          开始使用
        </Button>
      </div>
    </div>
  );
};
export default Home;
