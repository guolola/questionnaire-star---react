import React, { type FC, type JSX } from 'react';
import {
  DndContext, // dnd-kit 的核心上下文组件，提供拖拽环境
  closestCenter, // 碰撞检测算法，决定拖拽目标的判定方式
  MouseSensor, // 鼠标传感器，监听鼠标拖拽
  useSensor, // 创建单个传感器的 hook
  useSensors, // 创建多个传感器的 hook
  type DragEndEvent, // 拖拽结束事件类型
} from '@dnd-kit/core';
import {
  // arrayMove, // 可用于数组排序（未用到）
  SortableContext, // 提供可排序的上下文
  verticalListSortingStrategy, // 垂直列表排序策略
} from '@dnd-kit/sortable';

// 组件 props 类型定义
// items: 拖拽排序的元素数组，需包含唯一 id 字段
// onDragEnd: 拖拽结束时的回调，返回旧索引和新索引
// children: 需要被排序的子元素（通常为一组 SortableItem）
type PropsType = {
  children: JSX.Element | JSX.Element[];
  items: Array<{ id: string; [key: string]: any }>;
  onDragEnd: (oldIndex: number, newIndex: number) => void;
};

// 拖拽排序容器组件，封装 dnd-kit 的上下文和排序逻辑
const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd } = props;

  // 配置拖拽传感器，这里只用鼠标，且拖动距离超过 8px 才激活拖拽
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 拖动超过 8px 才开始拖拽，防止误触
      },
    }),
  );

  // 拖拽结束时的处理函数
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event; // active: 被拖拽的元素，over: 目标元素
    if (over == null) return; // 没有目标则不处理

    // 只有当拖拽目标和原位置不同才触发排序
    if (active.id !== over.id) {
      // 注意：items 里的元素要有 fe_id 字段，且唯一
      const oldIndex = items.findIndex(c => c.fe_id === active.id);
      const newIndex = items.findIndex(c => c.fe_id === over.id);
      onDragEnd(oldIndex, newIndex); // 通知父组件更新顺序
    }
  }

  return (
    // DndContext 提供拖拽上下文，配置传感器和拖拽结束回调
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* SortableContext 提供排序上下文，items 必须是唯一 id 数组 */}
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {/* 渲染所有可排序的子元素 */}
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default SortableContainer;
