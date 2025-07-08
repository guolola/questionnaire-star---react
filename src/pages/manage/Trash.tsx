import React, { useState } from 'react';
import { Empty, Typography, Table, Tag, Space, Button, Modal, message, Spin } from 'antd';
import styles from './styles/common.module.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ListSearch from '../../components/ListSearch';
import useLoadQuestionListData from '../../hooks/useLoadQuestionListData';

const { Title } = Typography;
const { confirm } = Modal;
const Star = () => {
  const { data = {}, loading } = useLoadQuestionListData({ isDeleted: true });
  const { list: questionList = [], total = 0 } = data;
  // 记录选中的id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function del() {
    confirm({
      title: '确定要删除吗该问卷吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: () => message.success('删除成功'),
    });
  }
  const tableColums = [
    {
      title: '问卷名称',
      dataIndex: 'title',
    },
    {
      title: '是否发布',
      dataIndex: 'isPublished',
      render: (isPublished: boolean) => {
        return isPublished ? <Tag color="processing">已发布</Tag> : <Tag>未发布</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '答卷数量',
      dataIndex: 'answerCount',
    },
  ];
  // 可以把JSX作为一个变量
  const TableElem = (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Button type="primary" disabled={selectedIds.length == 0}>
            恢复
          </Button>
          <Button danger disabled={selectedIds.length == 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <Table
        dataSource={questionList}
        columns={tableColums}
        pagination={false}
        rowKey={q => q._id}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedIds(selectedRowKeys as string[]);
          },
        }}
      />
    </>
  );
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        )}
        {!loading && questionList.length === 0 && <Empty description="暂无数据" />}
        {questionList.length > 0 && TableElem}
      </div>
      <div className={styles.footer}>loadMore... 上滑加载更多</div>
    </>
  );
};

export default Star;
