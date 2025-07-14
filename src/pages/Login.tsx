import React, { FC, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Space, Form, Input, Button, Checkbox, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { REGISTER_PATHNAME, MANAGE_INDEX_PATHNAME } from '../router';
import { loginService } from '../services/user';
import { setToken } from '../utils/user-token';
import styles from './styles/Login.module.scss';

const { Title } = Typography;

const USERNAME_KEY = 'USERNAME';
const PASSWORD_KEY = 'PASSWORD';

function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}

function getUserInfoFromStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
}

const Login: FC = () => {
  const nav = useNavigate();

  const [form] = Form.useForm(); // 第三方 hook

  useEffect(() => {
    const { username, password } = getUserInfoFromStorage();
    form.setFieldsValue({ username, password });
  }, []);

  const { run } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { token = '' } = result;
        setToken(token); // 存储 token

        message.success('登录成功');
        nav(MANAGE_INDEX_PATHNAME); // 导航到“我的问卷”
      },
    },
  );

  const onFinish = (values: any) => {
    const { username, password, remember } = values || {};

    run(username, password); // 执行 ajax

    if (remember) {
      rememberUser(username, password);
    } else {
      deleteUserFromStorage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <UserAddOutlined className={styles.logoIcon} />
            <Title level={2} className={styles.logoText}>问卷星</Title>
          </div>
          <Title level={3} className={styles.title}>用户登录</Title>
          <p className={styles.subtitle}>欢迎回来，请登录您的账户</p>
        </div>
        
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          className={styles.form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { type: 'string', min: 5, max: 20, message: '字符长度在 5-20 之间' },
              { pattern: /^\w+$/, message: '只能是字母数字下划线' },
            ]}
          >
            <Input 
              size="large" 
              placeholder="请输入用户名"
              className={styles.input}
            />
          </Form.Item>
          
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              size="large" 
              placeholder="请输入密码"
              className={styles.input}
            />
          </Form.Item>
          
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className={styles.checkbox}>记住我</Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              className={styles.submitButton}
              block
            >
              登录
            </Button>
          </Form.Item>
          
          <div className={styles.footer}>
            <span>还没有账户？</span>
            <Link to={REGISTER_PATHNAME} className={styles.link}>
              立即注册
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
