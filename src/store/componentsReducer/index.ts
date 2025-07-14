import { createSlice, nanoid } from '@reduxjs/toolkit';
import { type ComponentPropsType } from '../../components/QuestionComponents';
import { getNextSelectedId, insertNewComponent } from './utils';
import cloneDeep from 'lodash/cloneDeep';
import { arrayMove } from '@dnd-kit/sortable';

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
  copiedComponent: ComponentInfoType | null;
};

const INIT_STATE: ComponentsStateType = {
  selectedId: '',
  componentList: [],
  copiedComponent: null,
};

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
      insertNewComponent(draft, newComponent);
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
    // 拷贝 组件
    copyComponent: draft => {
      const { selectedId, componentList } = draft;
      const targetComponent = componentList.find(c => c.fe_id === selectedId);
      if (selectedId == null) return;
      draft.copiedComponent = cloneDeep(targetComponent); // 深拷贝
    },
    // 粘贴 组件
    pasteComponent: draft => {
      const { copiedComponent } = draft;
      if (copiedComponent == null) return;
      // 要把fe_id修改了，注意！
      copiedComponent.fe_id = nanoid();
      insertNewComponent(draft, copiedComponent);
    },
    // 选中上一个
    selectPrevComponent: (draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft;
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId);

      if (selectedIndex < 0) return; // 未选中组件
      if (selectedIndex <= 0) return; // 已经选中了第一个，无法在向上选中

      draft.selectedId = componentList[selectedIndex - 1].fe_id;
    },

    // 选中下一个
    selectNextComponent: (draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft;
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId);

      if (selectedIndex < 0) return; // 未选中组件
      if (selectedIndex + 1 === componentList.length) return; // 已经选中了最后一个，无法再向下选中

      draft.selectedId = componentList[selectedIndex + 1].fe_id;
    },
    // 移动组件位置
    moveComponent: (draft, action) => {
      const { componentList } = draft;
      const { oldIndex, newIndex } = action.payload;
      draft.componentList = arrayMove(componentList, oldIndex, newIndex);
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
  copyComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  moveComponent,
} = componentsSlice.actions;
export default componentsSlice.reducer;
