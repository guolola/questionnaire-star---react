import { useSelector } from 'react-redux';
import { type StateType } from '../store';
import { type ComponentsStateType } from '../store/componentsReducer';

function useGetComponentInfo() {
  // redux store
  const components = useSelector<StateType>(state => state.components) as ComponentsStateType;

  const { componentList = [], selectedId } = components;

  const selectedComponent = componentList.find(component => component.fe_id === selectedId);

  return {
    componentList,
    selectedId,
    selectedComponent,
  };
}

export default useGetComponentInfo;
