import React, { FC, useRef, useEffect, useState } from 'react'
import { Button, Card, Space, message } from 'antd'
import { ClearOutlined, UndoOutlined, DownloadOutlined } from '@ant-design/icons'
import { type QuestionSignaturePropsType } from './interface'

const QuestionSignature: FC<QuestionSignaturePropsType> = (props: QuestionSignaturePropsType) => {
  const { 
    title, 
    width = 400, 
    height = 200, 
    strokeColor = '#000000', 
    strokeWidth = 2, 
    backgroundColor = '#ffffff',
    disabled,
    required = false,
    value,
    onChange 
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [paths, setPaths] = useState<Array<{ x: number; y: number; drawing: boolean }>>([])
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          setHasSignature(true)
        }
        img.src = value
      }
    }
  }, [value])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const getTouchCoordinates = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const touch = e.touches[0]
    
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    setPaths(prev => [...prev, { x, y, drawing: true }])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    
    const { x, y } = getCoordinates(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (ctx && paths.length > 0) {
      const lastPoint = paths[paths.length - 1]
      
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      setPaths(prev => [...prev, { x, y, drawing: true }])
      setHasSignature(true)
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    
    setIsDrawing(false)
    setPaths(prev => [...prev, { x: 0, y: 0, drawing: false }])
    
    // 保存签名
    if (onChange && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL()
      onChange(dataURL)
    }
  }

  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    e.preventDefault()
    setIsDrawing(true)
    const { x, y } = getTouchCoordinates(e)
    setPaths(prev => [...prev, { x, y, drawing: true }])
  }

  const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    
    e.preventDefault()
    const { x, y } = getTouchCoordinates(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (ctx && paths.length > 0) {
      const lastPoint = paths[paths.length - 1]
      
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      setPaths(prev => [...prev, { x, y, drawing: true }])
      setHasSignature(true)
    }
  }

  const stopTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    e.preventDefault()
    setIsDrawing(false)
    setPaths(prev => [...prev, { x: 0, y: 0, drawing: false }])
    
    // 保存签名
    if (onChange && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL()
      onChange(dataURL)
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    setPaths([])
    setHasSignature(false)
    
    if (onChange) {
      onChange('')
    }
  }

  const undoLastStroke = () => {
    // 找到最后一个完整的笔画
    const lastStrokeIndex = paths.reduceRight((acc, path, index) => {
      if (acc === -1 && !path.drawing) {
        return index
      }
      return acc
    }, -1)
    
    if (lastStrokeIndex > -1) {
      const newPaths = paths.slice(0, lastStrokeIndex)
      setPaths(newPaths)
      redrawCanvas(newPaths)
    }
  }

  const redrawCanvas = (pathsToRedraw: Array<{ x: number; y: number; drawing: boolean }>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (!ctx) return
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 重绘所有路径
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    let currentPath: { x: number; y: number }[] = []
    
    pathsToRedraw.forEach(point => {
      if (point.drawing) {
        currentPath.push({ x: point.x, y: point.y })
      } else {
        if (currentPath.length > 1) {
          ctx.beginPath()
          ctx.moveTo(currentPath[0].x, currentPath[0].y)
          for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].x, currentPath[i].y)
          }
          ctx.stroke()
        }
        currentPath = []
      }
    })
    
    const hasContent = pathsToRedraw.some(path => path.drawing)
    setHasSignature(hasContent)
    
    if (onChange) {
      onChange(hasContent ? canvas.toDataURL() : '')
    }
  }

  const downloadSignature = () => {
    if (!hasSignature || !canvasRef.current) {
      message.error('请先进行签名')
      return
    }
    
    const link = document.createElement('a')
    link.download = `signature_${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (ctx) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [backgroundColor])

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
        {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </div>
      
      <Card>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'crosshair',
            display: 'block',
            margin: '0 auto 16px',
            maxWidth: '100%',
            backgroundColor: backgroundColor
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startTouchDrawing}
          onTouchMove={touchDraw}
          onTouchEnd={stopTouchDrawing}
        />
        
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button
              icon={<ClearOutlined />}
              onClick={clearSignature}
              disabled={disabled || !hasSignature}
            >
              清空
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={undoLastStroke}
              disabled={disabled || paths.length === 0}
            >
              撤销
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadSignature}
              disabled={!hasSignature}
            >
              下载
            </Button>
          </Space>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: '12px', color: '#666' }}>
          请在上方区域进行签名
        </div>
      </Card>
    </div>
  )
}

export default QuestionSignature