import { useDispatch } from 'react-redux';
import useGetComponentInfo from '../../../hooks/useGetComponentInfo';
import {
  getComponentConfByType,
  type ComponentPropsType,
} from '../../../components/QuestionComponents';
import { changeComponentProps } from '../../../store/componentsReducer';

const NoProp = () => <div style={{ textAlign: 'center' }}>未选中组件</div>;
const ComponentProp = () => {
  const dispatch = useDispatch();
  const { selectedComponent } = useGetComponentInfo();
  if (!selectedComponent) return <NoProp />;
  const { type, props, isLocked } = selectedComponent;
  const ComponentConf = getComponentConfByType(type);
  if (!ComponentConf) return <NoProp />;
  const { PropComponent } = ComponentConf;
  function changeProps(newProps: ComponentPropsType) {
    if (selectedComponent == null) return;
    const { fe_id } = selectedComponent;
    dispatch(changeComponentProps({ fe_id, newProps }));
  }
  return (
    <div>
      <PropComponent {...props} onChange={changeProps} disabled={isLocked}></PropComponent>
    </div>
  );
};

export default ComponentProp;
