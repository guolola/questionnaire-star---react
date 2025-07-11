import { createSlice } from '@reduxjs/toolkit';
import { type ComponentPropsType } from '../../components/QuestionComponents';

export type ComponentInfoType = {
  fe_id: string; // 前端组件唯一标识符
  type: string;
  title: string;
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
  },
});

export const { resetComponents, changeSelectedId, addComponent } = componentsSlice.actions;
export default componentsSlice.reducer;
