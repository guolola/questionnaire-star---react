import { useSelector } from 'react-redux';
import { type StateType } from '../store';
import { type ComponentsStateType } from '../store/componentsReducer';

function useGetComponentInfo() {
  // redux store
  const components = useSelector<StateType>(state => state.components) as ComponentsStateType;

  const { componentList = [], selectedId } = components;

  return {
    componentList,
    selectedId,
  };
}

export default useGetComponentInfo;
