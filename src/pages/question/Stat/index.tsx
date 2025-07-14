import React from 'react';
import { Typography, Card, Row, Col, Statistic, Progress, Empty } from 'antd';
import { BarChartOutlined, UserOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import useLoadQuestionData from '../../../hooks/useLoadQuestionData';
import styles from './index.module.scss';

const { Title, Paragraph } = Typography;

const Stat = () => {
  const { loading, data } = useLoadQuestionData();

  // 模拟统计数据
  const mockStats = {
    totalAnswers: 1248,
    todayAnswers: 56,
    completionRate: 87.5,
    avgTime: '3分25秒',
    chartData: [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 52 },
      { date: '2024-01-03', count: 38 },
      { date: '2024-01-04', count: 67 },
      { date: '2024-01-05', count: 58 },
    ]
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>正在加载统计数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          <BarChartOutlined className={styles.titleIcon} />
          问卷统计分析
        </Title>
        <Paragraph className={styles.subtitle}>
          实时统计数据，全面了解问卷收集情况
        </Paragraph>
      </div>

      <div className={styles.statsGrid}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="总回答数"
                value={mockStats.totalAnswers}
                prefix={<UserOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="今日新增"
                value={mockStats.todayAnswers}
                prefix={<EyeOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="完成率"
                value={mockStats.completionRate}
                suffix="%"
                prefix={<BarChartOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="平均用时"
                value={mockStats.avgTime}
                prefix={<CalendarOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#8b5cf6' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]} className={styles.chartsSection}>
        <Col xs={24} lg={16}>
          <Card className={styles.chartCard} title="回答趋势">
            <div className={styles.chartPlaceholder}>
              <BarChartOutlined className={styles.chartIcon} />
              <p>图表组件待集成</p>
              <small>可集成 ECharts 或 Chart.js 等图表库</small>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className={styles.chartCard} title="答题完成情况">
            <div className={styles.progressSection}>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>完成答题</span>
                  <span>{Math.round(mockStats.totalAnswers * mockStats.completionRate / 100)}</span>
                </div>
                <Progress 
                  percent={mockStats.completionRate} 
                  strokeColor="#6366f1"
                  showInfo={false}
                />
              </div>
              
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>部分完成</span>
                  <span>{Math.round(mockStats.totalAnswers * 0.08)}</span>
                </div>
                <Progress 
                  percent={8} 
                  strokeColor="#f59e0b"
                  showInfo={false}
                />
              </div>
              
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>未完成</span>
                  <span>{Math.round(mockStats.totalAnswers * 0.045)}</span>
                </div>
                <Progress 
                  percent={4.5} 
                  strokeColor="#ef4444"
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className={styles.detailsCard} title="详细数据分析">
        <Empty 
          description="详细数据分析功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </div>
  );
};

export default Stat;
