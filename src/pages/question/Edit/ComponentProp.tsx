import useGetComponentInfo from '../../../hooks/useGetComponentInfo';
import { getComponentConfByType } from '../../../components/QuestionComponents';

const NoProp = () => <div style={{ textAlign: 'center' }}>未选中组件</div>;
const ComponentProp = () => {
  const { selectedComponent } = useGetComponentInfo();
  if (!selectedComponent) return <NoProp />;
  const { type, props } = selectedComponent;
  const ComponentConf = getComponentConfByType(type);
  if (!ComponentConf) return <NoProp />;
  const { PropComponent } = ComponentConf;
  return (
    <div>
      <PropComponent {...props}></PropComponent>
    </div>
  );
};

export default ComponentProp;
