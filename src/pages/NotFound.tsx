import { useNavigate } from 'react-router-dom';
import { Result, Button, Typography } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { MANAGE_INDEX_PATHNAME } from '../router';
import styles from './styles/NotFound.module.scss';

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.illustration}>
          <div className={styles.number404}>404</div>
          <div className={styles.astronaut}>🚀</div>
        </div>
        
        <Title level={2} className={styles.title}>
          页面走丢了
        </Title>
        
        <Paragraph className={styles.description}>
          抱歉，您访问的页面可能已被删除、重命名或暂时不可用
        </Paragraph>
        
        <div className={styles.actions}>
          <Button 
            type="primary" 
            size="large"
            icon={<HomeOutlined />}
            className={styles.primaryButton}
            onClick={() => nav(MANAGE_INDEX_PATHNAME)}
          >
            返回首页
          </Button>
          
          <Button 
            size="large"
            icon={<SearchOutlined />}
            className={styles.secondaryButton}
            onClick={() => window.history.back()}
          >
            返回上页
          </Button>
        </div>
        
        <div className={styles.suggestions}>
          <Title level={4} className={styles.suggestionsTitle}>
            您可以尝试：
          </Title>
          <ul className={styles.suggestionsList}>
            <li>检查网址是否正确</li>
            <li>返回上一页重新开始</li>
            <li>访问问卷星首页</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
