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
  },
});

export const { resetComponents, changeSelectedId } = componentsSlice.actions;
export default componentsSlice.reducer;
