import React from 'react';
import { Space, Typography } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './styles/Logo.module.scss';

const { Title } = Typography;
const Logo = () => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <Space>
          <Title style={{ margin: 0 }}>
            <FormOutlined />
          </Title>
          <Title style={{ margin: 0 }}>小慕问卷</Title>
        </Space>
      </Link>
    </div>
  );
};

export default Logo;
