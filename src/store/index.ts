import { configureStore } from '@reduxjs/toolkit';
import undoable, { excludeAction, type StateWithHistory } from 'redux-undo';
import userReducer, { type UserStateType } from './userReducer';
import componentsReducer, { type ComponentsStateType } from './componentsReducer';
// import pageInfoReducer, { PageInfoType } from './pageInfoReducer';

export type StateType = {
  user: UserStateType;
  components: ComponentsStateType;
  // components: StateWithHistory<ComponentsStateType>; // 增加了 undo
  // pageInfo: PageInfoType;
};

export default configureStore({
  reducer: {
    user: userReducer,
    components: componentsReducer,
    // 组件列表(复杂，undo/redo)
  },
});
