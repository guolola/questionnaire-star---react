import React, { type FC, type JSX } from 'react';
import { useSortable } from '@dnd-kit/sortable'; // dnd-kit 提供的 hook，用于实现单个可排序元素的拖拽逻辑
import { CSS } from '@dnd-kit/utilities'; // 用于处理拖拽时的样式变换

// 组件 props 类型定义
// id: 唯一标识（必须与父容器 items 的 id 对应）
// children: 需要被包裹的实际渲染内容
//
type PropsType = {
  id: string;
  children: JSX.Element;
};

// 单个可拖拽排序的元素组件
const SortableItem: FC<PropsType> = ({ id, children }) => {
  // useSortable 返回一组用于拖拽的属性和方法
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  // 拖拽时的样式设置
  const style = {
    transform: CSS.Transform.toString(transform), // 将 transform 对象转为 CSS 字符串
    transition, // 拖拽动画过渡
  };

  return (
    // setNodeRef 绑定 DOM 节点，attributes/listeners 用于拖拽交互
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
