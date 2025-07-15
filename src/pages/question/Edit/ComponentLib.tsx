import Title from 'antd/es/typography/Title';
import { Input, Badge, Empty, Button } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { componentConfGroup } from '../../../components/QuestionComponents';
import { useDispatch } from 'react-redux';
import { addComponent } from '../../../store/componentsReducer';
import styles from './styles/ComponentLib.module.scss';
import { nanoid } from '@reduxjs/toolkit';
import { useState, useMemo } from 'react';

// 改成组件
function ComponentLibItem({ c, isFavorite, onToggleFavorite }) {
  const { title, type, Component, defaultProps } = c;
  const dispatch = useDispatch();
  
  function handleClick() {
    dispatch(addComponent({ fe_id: nanoid(), title, type, props: defaultProps }));
  }
  
  function handleFavoriteClick(e) {
    e.stopPropagation();
    onToggleFavorite(type);
  }
  
  // 根据组件类型决定预览高度
  const isLargeComponent = [
    'QuestionTextarea', 
    'QuestionMatrix', 
    'QuestionFileUpload',
    'QuestionRanking',
    'QuestionImageChoice',
    'QuestionContactInfo',
    'QuestionSignature'
  ].includes(type);
  
  const wrapperClass = isLargeComponent ? 
    `${styles.wrapper} ${styles.largeWrapper}` : 
    styles.wrapper;
  
  return (
    <div className={wrapperClass} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
      <div className={styles.componentTitle}>
        {title}
      </div>
      <div className={styles.favoriteBtn} onClick={handleFavoriteClick}>
        {isFavorite ? '★' : '☆'}
      </div>
    </div>
  );
}

const Lib = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set(['QuestionInput', 'QuestionRadio', 'QuestionCheckbox'])); // 默认收藏一些常用组件
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 切换收藏状态
  const toggleFavorite = (componentType) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(componentType)) {
        newFavorites.delete(componentType);
      } else {
        newFavorites.add(componentType);
      }
      return newFavorites;
    });
  };

  // 过滤组件
  const filteredGroups = useMemo(() => {
    let groups = componentConfGroup;
    
    // 如果只显示收藏的组件
    if (showFavoritesOnly) {
      groups = groups.map(group => ({
        ...group,
        components: group.components.filter(c => favorites.has(c.type))
      })).filter(group => group.components.length > 0);
    }
    
    // 如果有搜索词
    if (searchTerm.trim()) {
      groups = groups.map(group => ({
        ...group,
        components: group.components.filter(c => 
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.components.length > 0);
    }
    
    return groups;
  }, [searchTerm, showFavoritesOnly, favorites]);

  // 计算总组件数
  const totalComponents = componentConfGroup.reduce((sum, group) => sum + group.components.length, 0);
  const filteredTotal = filteredGroups.reduce((sum, group) => sum + group.components.length, 0);

  return (
    <div className={styles.libContainer}>
      {/* 搜索栏 */}
      <div className={styles.searchContainer}>
        <Input
          placeholder="搜索组件..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className={styles.searchInput}
        />
        <div className={styles.filterRow}>
          <Button
            size="small"
            type={showFavoritesOnly ? "primary" : "default"}
            icon={showFavoritesOnly ? <StarFilled /> : <StarOutlined />}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={styles.favoriteFilter}
          >
            收藏 ({favorites.size})
          </Button>
          <div className={styles.componentCount}>
            <Badge count={filteredTotal} showZero color="#1890ff" />
            <span className={styles.totalCount}>/ {totalComponents}</span>
          </div>
        </div>
      </div>

      {/* 组件列表 */}
      <div className={styles.componentsContainer}>
        {filteredGroups.length === 0 ? (
          <Empty 
            description="没有找到匹配的组件" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
          />
        ) : (
          filteredGroups.map((group, index) => {
            const { groupId, groupName, components } = group;
            return (
              <div key={groupId} className={styles.groupContainer}>
                <Title level={3} className={styles.groupTitle}>
                  {groupName}
                  <Badge count={components.length} size="small" color="#52c41a" />
                </Title>
                <div className={styles.componentsGrid}>
                  {components.map(c => (
                    <ComponentLibItem 
                      key={c.type} 
                      c={c} 
                      isFavorite={favorites.has(c.type)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Lib;
