import { type ComponentInfoType, type ComponentsStateType } from './index';

export function getNextSelectedId(fe_id: string, componentList: ComponentInfoType[]) {
  const visibleComponentList = componentList.filter(c => !c.isHidden);
  const index = visibleComponentList.findIndex(c => c.fe_id === fe_id);
  if (index < 0) return '';
  // 重新计算 selectedId
  let newSelectedId = '';
  const length = componentList.length;
  if (length <= 1) {
    newSelectedId = '';
  } else {
    // 组件长度>1
    if (index + 1 === length) {
      // 要删除最后一个，就要选中上一个
      newSelectedId = componentList[index - 1].fe_id;
    } else {
      // 要删除的不是最后一个，删除以后，选中下一个
      newSelectedId = componentList[index + 1].fe_id;
    }
  }
  return newSelectedId;
}

// 插入新组件
export function insertNewComponent(draft: ComponentsStateType, newComponent: ComponentInfoType) {
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
}
