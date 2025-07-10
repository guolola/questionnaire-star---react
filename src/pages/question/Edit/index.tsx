import useLoadQuestionData from '../../../hooks/useLoadQuestionData';

import styles from './styles/index.module.scss';
// 引入画布组件
import EditCanvas from './EditCanvas';
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
      <div style={{ backgroundColor: '#fff', height: '40px' }}>Header</div>
      <div className={styles['content-wrapper']}>
        <div className={styles.content}>
          <div className={styles.left}>Left</div>
          <div className={styles.main} onClick={clearSelected}>
            <div className={styles['canvas-wrapper']}>
              <div style={{ height: '900px' }}>
                <EditCanvas loading={loading} />
              </div>
            </div>
          </div>
          <div className={styles.right}>Right</div>
        </div>
      </div>
    </div>
  );
};
export default Edit;
