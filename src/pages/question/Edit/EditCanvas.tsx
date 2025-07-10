import styles from './styles/EditCanvas.module.scss';

import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import useGetComponentInfo from '../../../hooks/useGetComponentInfo';
import { getComponentConfByType } from '../../../components/QuestionComponents';
import { changeSelectedId, type ComponentInfoType } from '../../../store/componentsReducer';

type PropsType = {
  loading: boolean;
};

// 生成组件
function genComponent(componentInfo: ComponentInfoType) {
  const { type, props } = componentInfo;
  const componentConf = getComponentConfByType(type);
  if (componentConf == null) return null;
  const { Component } = componentConf;
  return <Component {...props} />;
}
const EditCanvas: React.FC<PropsType> = ({ loading }) => {
  const { componentList, selectedId } = useGetComponentInfo();
  const dispatch = useDispatch();
  function hadleClick(event, id: string) {
    event.stopPropagation();
    dispatch(changeSelectedId(id));
  }
  if (loading)
    return (
      <div>
        <Spin></Spin>
      </div>
    );
  return (
    <div className={styles['canvas']}>
      {componentList.map(c => {
        const { fe_id } = c;
        // 拼接class name
        const wrapperDefaultClassName = styles['component-wrapper'];
        const selectedClassnName = styles.selected;
        const wrapperClassName = classNames({
          [wrapperDefaultClassName]: true,
          [selectedClassnName]: fe_id === selectedId,
        });
        return (
          <div key={fe_id} className={wrapperClassName} onClick={e => hadleClick(e, fe_id)}>
            <div className={styles.component}>{genComponent(c)}</div>
          </div>
        );
      })}
    </div>
  );
};
export default EditCanvas;
