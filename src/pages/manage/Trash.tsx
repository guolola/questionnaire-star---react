import React, { useState } from 'react';
import { Empty, Typography, Table, Tag, Space, Button, Modal, message } from 'antd';
import styles from './styles/common.module.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';


const { Title } = Typography;
const { confirm } = Modal;
// 定义问卷数据类型
type QuestionType = {
  _id: string;
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createdAt: string;
};
// 模拟问卷数据
const rawQuestionList: QuestionType[] = [
  {
    _id: '1',
    title: '用户满意度调查',
    isStar: true,
    isPublished: true,
    answerCount: 10,
    createdAt: '2024-05-01',
  },
  {
    _id: '2',
    title: '产品功能反馈',
    isStar: true,
    isPublished: false,
    answerCount: 5,
    createdAt: '2024-05-02',
  },
  {
    _id: '3',
    title: '市场调研问卷',
    isStar: true,
    isPublished: true,
    answerCount: 8,
    createdAt: '2024-05-03',
  },
  {
    _id: '4',
    title: '员工培训评估',
    isStar: true,
    isPublished: false,
    answerCount: 3,
    createdAt: '2024-05-04',
  },
];
const Star = () => {
  const [questionList, setQuestionList] = useState(rawQuestionList);
  // 记录选中的id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function del(){
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
    {
      title: '操作',
      dataIndex: 'action',
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
        <div className={styles.right}>(搜索)</div>
      </div>
      <div className={styles.content}>
        {questionList.length === 0 && <Empty description="暂无数据" />}
        {questionList.length > 0 && TableElem}
      </div>
      <div className={styles.footer}>loadMore... 上滑加载更多</div>
    </>
  );
};

export default Star;
