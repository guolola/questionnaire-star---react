import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { LOGIN_PATHNAME } from '../router';
import styles from './styles/UserInfo.module.scss';

const UserInfo = () => {
  return (
    <div className={styles.container}>
      <Button type="primary" className={styles.loginButton}>
        <Link to={LOGIN_PATHNAME} className={styles.loginLink}>登录</Link>
      </Button>
    </div>
  );
};

export default UserInfo;
