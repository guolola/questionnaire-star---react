import React from 'react';
import { Typography, Progress } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const { Text } = Typography;

interface ModernLoadingProps {
  visible: boolean;
  text?: string;
  showProgress?: boolean;
  progress?: number;
  type?: 'spinner' | 'progress' | 'dots';
}

const ModernLoading: React.FC<ModernLoadingProps> = ({
  visible,
  text = '正在加载...',
  showProgress = false,
  progress = 0,
  type = 'spinner'
}) => {
  if (!visible) return null;

  const renderLoader = () => {
    switch (type) {
      case 'progress':
        return (
          <div className={styles.progressContainer}>
            <div className={styles.progressRing}>
              <Progress
                type="circle"
                percent={progress}
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2'
                }}
                strokeWidth={6}
                size={80}
                format={() => ''}
              />
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      default:
        return (
          <div className={styles.spinnerContainer}>
            <div className={styles.modernSpinner}>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.content}>
          {renderLoader()}
          <Text className={styles.loadingText}>{text}</Text>
          {showProgress && type !== 'progress' && (
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernLoading;