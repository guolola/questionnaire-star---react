import { Space, Typography, Form, Input, Button, Checkbox } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { REGISTER_PATHNAME } from '../router';
import styles from './styles/Register.module.scss';
import { useEffect } from 'react';

const { Title } = Typography;

const USERNAME_KEY = 'USERNAME';
const PASSWORD_KEY = 'PASSWORD';

// 存储用户信息
function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}
// 删除用户信息
function forgetUser() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}
// 获取用户信息
function getUserInfo() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
}
const Login = () => {
  // 获取Form表单组件
  const [form] = Form.useForm();
  useEffect(() => {
    const { username, password } = getUserInfo();
    form.setFieldsValue({ username, password });
  }, []);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const { username, password, remember } = values;
    if (remember) {
      rememberUser(username, password);
    } else {
      forgetUser();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>用户登录</Title>
        </Space>
      </div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={{ remember: true }}
        form={form}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
          <Checkbox>记住我</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
          <Link to={REGISTER_PATHNAME}>注册新用户</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
