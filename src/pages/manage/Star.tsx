import { Empty, Spin, Typography } from 'antd';
import QuestionCard from '../../components/QuestionCard';
import styles from './styles/common.module.scss';
import ListSearch from '../../components/ListSearch';
import useLoadQuestionListData from '../../hooks/useLoadQuestionListData';

const { Title } = Typography;

const Star = () => {
  const { data = {}, loading } = useLoadQuestionListData({ isStar: true });
  const { list: questionList = [], total = 0 } = data;
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
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        )}
        {!loading && questionList.length === 0 && <Empty description="暂无数据" />}
        {questionList.length > 0 &&
          questionList.map(q => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>loadMore... 上滑加载更多</div>
    </>
  );
};

export default Star;
