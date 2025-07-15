import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Card, Typography, List, Space, Select, InputNumber, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, DragOutlined } from '@ant-design/icons'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type QuestionnairePage, createPage } from '../../utils/multiPageSupport'

const { Title, Text } = Typography
const { TextArea } = Input

interface MultiPageEditorProps {
  visible: boolean
  onClose: () => void
  onSave: (pages: QuestionnairePage[]) => void
  pages: QuestionnairePage[]
  questions: Array<{ id: string; title: string; type: string }>
}

interface SortablePageItemProps {
  page: QuestionnairePage
  index: number
  onEdit: (page: QuestionnairePage) => void
  onDelete: (pageId: string) => void
  questions: Array<{ id: string; title: string; type: string }>
}

const SortablePageItem: FC<SortablePageItemProps> = ({ page, index, onEdit, onDelete, questions }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const pageQuestions = questions.filter(q => page.questionIds.includes(q.id))

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        style={{ marginBottom: 8 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
              <DragOutlined />
            </div>
            <span>第{index + 1}页: {page.title}</span>
          </div>
        }
        extra={
          <Space>
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(page)} />
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(page.id)} />
          </Space>
        }
      >
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">包含问题: {pageQuestions.length}个</Text>
        </div>
        {page.description && (
          <div style={{ marginBottom: 8 }}>
            <Text>{page.description}</Text>
          </div>
        )}
        <div style={{ maxHeight: 100, overflowY: 'auto' }}>
          {pageQuestions.map(q => (
            <div key={q.id} style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
              • {q.title}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const MultiPageEditor: FC<MultiPageEditorProps> = ({
  visible,
  onClose,
  onSave,
  pages,
  questions
}) => {
  const [localPages, setLocalPages] = useState<QuestionnairePage[]>(pages)
  const [editingPage, setEditingPage] = useState<QuestionnairePage | null>(null)
  const [pageForm] = Form.useForm()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (editingPage) {
      pageForm.setFieldsValue({
        title: editingPage.title,
        description: editingPage.description,
        questionIds: editingPage.questionIds,
      })
    }
  }, [editingPage, pageForm])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = localPages.findIndex(page => page.id === active.id)
      const newIndex = localPages.findIndex(page => page.id === over.id)
      
      const newPages = arrayMove(localPages, oldIndex, newIndex).map((page, index) => ({
        ...page,
        order: index + 1
      }))
      
      setLocalPages(newPages)
    }
  }

  const handleCreatePage = () => {
    const newPage = createPage('新页面', [], localPages.length + 1)
    setLocalPages([...localPages, newPage])
    setEditingPage(newPage)
  }

  const handleEditPage = (page: QuestionnairePage) => {
    setEditingPage(page)
  }

  const handleDeletePage = (pageId: string) => {
    setLocalPages(localPages.filter(page => page.id !== pageId))
  }

  const handleSavePageEdit = () => {
    pageForm.validateFields().then(values => {
      if (editingPage) {
        const updatedPages = localPages.map(page =>
          page.id === editingPage.id
            ? { ...page, ...values }
            : page
        )
        setLocalPages(updatedPages)
        setEditingPage(null)
        pageForm.resetFields()
      }
    })
  }

  const handleAutoCreatePages = () => {
    const pageSize = 5 // 每页5个问题
    const newPages: QuestionnairePage[] = []
    
    for (let i = 0; i < questions.length; i += pageSize) {
      const pageQuestions = questions.slice(i, i + pageSize)
      const pageNumber = Math.floor(i / pageSize) + 1
      
      newPages.push(createPage(
        `第${pageNumber}页`,
        pageQuestions.map(q => q.id),
        pageNumber,
        `包含第${i + 1}到第${Math.min(i + pageSize, questions.length)}题`
      ))
    }
    
    setLocalPages(newPages)
  }

  const handleSave = () => {
    onSave(localPages)
    onClose()
  }

  const getUnusedQuestions = () => {
    const usedQuestionIds = new Set(localPages.flatMap(page => page.questionIds))
    return questions.filter(q => !usedQuestionIds.has(q.id))
  }

  return (
    <Modal
      title="多页面设置"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      width={1000}
      okText="保存"
      cancelText="取消"
    >
      <div style={{ display: 'flex', gap: 16, height: 600 }}>
        {/* 左侧页面列表 */}
        <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>页面列表</Title>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePage}>
                添加页面
              </Button>
              <Button onClick={handleAutoCreatePages}>
                自动分页
              </Button>
            </Space>
          </div>

          <div style={{ height: 500, overflowY: 'auto' }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={localPages.map(page => page.id)} strategy={verticalListSortingStrategy}>
                {localPages.map((page, index) => (
                  <SortablePageItem
                    key={page.id}
                    page={page}
                    index={index}
                    onEdit={handleEditPage}
                    onDelete={handleDeletePage}
                    questions={questions}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* 右侧编辑面板 */}
        <div style={{ flex: 1 }}>
          {editingPage ? (
            <Form form={pageForm} layout="vertical">
              <Title level={5}>编辑页面</Title>
              <Form.Item
                label="页面标题"
                name="title"
                rules={[{ required: true, message: '请输入页面标题' }]}
              >
                <Input placeholder="请输入页面标题" />
              </Form.Item>
              <Form.Item label="页面描述" name="description">
                <TextArea rows={3} placeholder="请输入页面描述（可选）" />
              </Form.Item>
              <Form.Item
                label="包含问题"
                name="questionIds"
                rules={[{ required: true, message: '请选择至少一个问题' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择问题"
                  style={{ width: '100%' }}
                  options={questions.map(q => ({ label: q.title, value: q.id }))}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" onClick={handleSavePageEdit}>
                    保存
                  </Button>
                  <Button onClick={() => setEditingPage(null)}>
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <div>
              <Title level={5}>未使用的问题</Title>
              <div style={{ height: 400, overflowY: 'auto' }}>
                <List
                  size="small"
                  dataSource={getUnusedQuestions()}
                  renderItem={(question) => (
                    <List.Item>
                      <Text>{question.title}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default MultiPageEditor