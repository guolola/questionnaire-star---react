import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography,  Layout, Space } from 'antd';
import { StarOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { MANAGE_INDEX_PATHNAME } from '../router';
import styles from './styles/Home.module.scss';
import axios from 'axios';

const { Title, Paragraph, Text, Link } = Typography;
const { Footer } = Layout;

const Home = () => {
  const nav = useNavigate();
  
  useEffect(() => {
    axios.get('/api/test').then(res => {
      console.log(res.data);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Title level={1} className={styles.heroTitle}>
            问卷星 <span className={styles.highlight}>QuestionStar</span>
          </Title>
          <Paragraph className={styles.heroDescription}>
            专业的在线问卷调查平台，集问卷设计、数据收集、统计分析于一体
          </Paragraph>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>创建问卷</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50,000+</div>
              <div className={styles.statLabel}>发布问卷</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100,000+</div>
              <div className={styles.statLabel}>收到答卷</div>
            </div>
          </div>
        </div>
        
        <div className={styles.heroActions}>
          <Button
            type="primary"
            size="large"
            className={styles.primaryButton}
            onClick={() => nav(MANAGE_INDEX_PATHNAME)}
          >
            开始使用
          </Button>
          <Button
            size="large"
            className={styles.secondaryButton}
            onClick={() => nav('/register')}
          >
            免费注册
          </Button>
        </div>
      </div>

     
      
      <Footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <div className={styles.footerSection}>
              <h4>问卷星</h4>
              <p>专业的在线问卷调查平台</p>
              <div className={styles.socialLinks}>
                <StarOutlined />
                <HeartOutlined />
                <GlobalOutlined />
              </div>
            </div>
            
            <div className={styles.footerSection}>
              <h4>产品功能</h4>
              <ul>
                <li><Link href="/features/design">问卷设计</Link></li>
                <li><Link href="/features/collect">数据收集</Link></li>
                <li><Link href="/features/analysis">统计分析</Link></li>
                <li><Link href="/features/ai">AI助手</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h4>帮助支持</h4>
              <ul>
                <li><Link href="/help">使用指南</Link></li>
                <li><Link href="/faq">常见问题</Link></li>
                <li><Link href="/contact">联系我们</Link></li>
                <li><Link href="/feedback">意见反馈</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h4>关于我们</h4>
              <ul>
                <li><Link href="/about">公司介绍</Link></li>
                <li><Link href="/careers">加入我们</Link></li>
                <li><Link href="/privacy">隐私政策</Link></li>
                <li><Link href="/terms">服务条款</Link></li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <div className={styles.copyright}>
              <Text>问卷星 QuestionStar &copy; 2025 - 让调研更简单</Text>
            </div>
            <div className={styles.links}>
              <Space split="|">
                <Link href="https://beian.miit.gov.cn/">京ICP备2022000055号-1</Link>
                <Text>版本 v2.0.0</Text>
                <Text>服务器状态: 正常</Text>
              </Space>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
};
export default Home;
