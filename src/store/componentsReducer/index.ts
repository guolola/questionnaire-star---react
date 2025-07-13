import { createSlice } from '@reduxjs/toolkit';
import { type ComponentPropsType } from '../../components/QuestionComponents';
import { getNextSelectedId } from './utils';

export type ComponentInfoType = {
  fe_id: string; // 前端组件唯一标识符
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: ComponentPropsType;
};

export type ComponentsStateType = {
  selectedId: string;
  componentList: ComponentInfoType[];
};

const INIT_STATE: ComponentsStateType = { selectedId: '', componentList: [] };

export const componentsSlice = createSlice({
  name: 'components',
  initialState: INIT_STATE,
  reducers: {
    // 重置所有组件
    resetComponents: (state, action) => {
      return action.payload;
    },
    // 修改 selectedId
    changeSelectedId: (draft, action) => {
      draft.selectedId = action.payload;
    },
    // 添加新组件
    addComponent: (draft, action) => {
      const newComponent = action.payload;
      const { componentList, selectedId } = draft;
      const index = componentList.findIndex(c => c.fe_id === selectedId);
      if (index < 0) {
        // 画布中未选中任何组件插入到末尾
        draft.componentList.push(newComponent);
      } else {
        // 画布中选中组件，插入到index后面
        draft.componentList.splice(index + 1, 0, newComponent);
      }
      // 重新设置选中组件
      draft.selectedId = newComponent.fe_id;
    },
    // 修改组件属性
    changeComponentProps: (draft, action) => {
      const { fe_id, newProps } = action.payload;
      const targetComponent = draft.componentList.find(c => c.fe_id === fe_id);
      if (!targetComponent) return;
      targetComponent.props = { ...targetComponent.props, ...newProps };
    },
    // 删除选中的组件
    removeSelectedComponent: draft => {
      const { componentList, selectedId } = draft;
      // 重新计算 selectedId
      const newSelectedId = getNextSelectedId(selectedId, componentList);
      draft.componentList = componentList.filter(c => c.fe_id !== selectedId);
      draft.selectedId = newSelectedId;
    },
    // 隐藏/显示 组件
    changeComponentHidden: (draft, action) => {
      const { componentList = [] } = draft;
      const { fe_id, isHidden } = action.payload;
      // 重新计算selectedId
      let newSelectedId = '';
      if (isHidden) {
        // 隐藏
        newSelectedId = getNextSelectedId(fe_id, componentList);
      } else {
        // 显示
        newSelectedId = fe_id;
      }
      draft.selectedId = newSelectedId;
      const targetComponent = componentList.find(c => c.fe_id === fe_id);
      if (!targetComponent) return;
      targetComponent.isHidden = isHidden;
    },
    // 锁定/解锁 组件
    toggleComponentLock: (draft, action) => {
      const { fe_id } = action.payload;
      const targetComponent = draft.componentList.find(c => c.fe_id === fe_id);
      if (targetComponent) {
        targetComponent.isLocked = !targetComponent.isLocked;
      }
    },
  },
});

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLock,
} = componentsSlice.actions;
export default componentsSlice.reducer;
