import React, { useState } from 'react';
import { Empty, Typography } from 'antd';
import QuestionCard from '../../components/QuestionCard';
import styles from './styles/common.module.scss';
import ListSearch from '../../components/ListSearch';

const { Title } = Typography;

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
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>星标问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {questionList.length === 0 && <Empty description="暂无数据" />}
        {questionList.length > 0 &&
          questionList.map((q: QuestionType) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>loadMore... 上滑加载更多</div>
    </>
  );
};

export default Star;
