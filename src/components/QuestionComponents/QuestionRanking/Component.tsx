import React, { FC } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import { type QuestionRankingPropsType, type RankingOptionType } from './interface'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
}

const SortableItem: FC<SortableItemProps> = ({ id, children, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

const QuestionRanking: FC<QuestionRankingPropsType> = (props: QuestionRankingPropsType) => {
  const { 
    title, 
    options = [], 
    disabled,
    value = [],
    onChange 
  } = props

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = value.findIndex(item => item.key === active.id)
      const newIndex = value.findIndex(item => item.key === over.id)
      
      const newValue = arrayMove(value, oldIndex, newIndex)
      if (onChange) {
        onChange(newValue)
      }
    }
  }

  // 初始化排序值
  React.useEffect(() => {
    if (value.length === 0 && options.length > 0 && onChange) {
      onChange([...options])
    }
  }, [options, value, onChange])

  const displayOptions = value.length > 0 ? value : options

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
      </div>
      <div style={{ marginBottom: 8, color: '#666', fontSize: '14px' }}>
        请拖拽下方选项进行排序（从上到下为优先级从高到低）
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displayOptions.map(item => item.key)} strategy={verticalListSortingStrategy}>
          {displayOptions.map((option, index) => (
            <SortableItem key={option.key} id={option.key} disabled={disabled}>
              <Card
                size="small"
                style={{
                  marginBottom: 8,
                  cursor: disabled ? 'not-allowed' : 'move',
                  backgroundColor: disabled ? '#f5f5f5' : '#fff'
                }}
                bodyStyle={{ padding: '8px 12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: 8, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: '#1890ff', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ flex: 1 }}>{option.text}</span>
                  <HolderOutlined style={{ color: '#999', cursor: disabled ? 'not-allowed' : 'move' }} />
                </div>
              </Card>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default QuestionRanking