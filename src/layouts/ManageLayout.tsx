import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, Space, Divider, message } from 'antd';
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { createQuestionService } from '../services/question';
import styles from './styles/ManageLayout.module.scss';

const ManageLayout = () => {
  const nav = useNavigate();
  // 获取当前路由
  const { pathname } = useLocation();
  const {
    loading,
    error,
    run: handleCreateClick,
  } = useRequest(createQuestionService, {
    manual: true,
    onSuccess(result) {
      // 成功后跳转到编辑页面
      nav(`/question/edit/${result.id}`);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Space direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading}
          >
            新建问卷
          </Button>
          <Divider style={{ borderTop: 'transparent' }} />
          <Button
            type={pathname.startsWith('/manage/list') ? 'default' : 'text'}
            size="large"
            icon={<BarsOutlined />}
            onClick={() => nav('/manage/list')}
          >
            我的问卷
          </Button>
          <Button
            type={pathname.startsWith('/manage/star') ? 'default' : 'text'}
            size="large"
            icon={<StarOutlined />}
            onClick={() => nav('/manage/star')}
          >
            星标问卷
          </Button>
          <Button
            type={pathname.startsWith('/manage/trash') ? 'default' : 'text'}
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => nav('/manage/trash')}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
function nav(arg0: string) {
  throw new Error('Function not implemented.');
}
