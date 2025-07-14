import useLoadQuestionData from '../../../hooks/useLoadQuestionData';

import styles from './styles/index.module.scss';
// 引入画布组件
import EditCanvas from './EditCanvas';
// 引入左侧面板组件
import LeftPanel from './LeftPanel';
// 引入右侧面板组件
import RightPanel from './RightPanel';
// 引入导航栏组件
import EditHeder from './EditHeader';
import { useDispatch } from 'react-redux';
import { changeSelectedId } from '../../../store/componentsReducer';
const Edit = () => {
  const dispatch = useDispatch();
  const { loading } = useLoadQuestionData();
  function clearSelected() {
    dispatch(changeSelectedId(''));
  }
  return (
    <div className={styles.container}>
      <EditHeder />
      <div className={styles['content-wrapper']}>
        <div className={styles.content}>
          <div className={styles.left}>
            <LeftPanel />
          </div>
          <div className={styles.main} onClick={clearSelected}>
            <div className={styles['canvas-wrapper']}>
              <div className={styles['canvas-content']}>
                <EditCanvas loading={loading} />
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Edit;
