import { type ComponentInfoType } from './index';

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
