[English](./README.md) | **简体中文**

<p align="center">
  <img src="./docs/brand/logo.png" width="120" height="120" alt="Questionnaire Star · 问卷编辑器 logo" />
</p>

<div align="center">

# Questionnaire Star · 问卷编辑器

<p>
  <strong>面向问卷搭建的可视化工作台</strong><br />
  在可视化工作台中使用可复用组件搭建问卷。<br />
  <sub>组合题目 · 编排画布 · 查看答卷统计</sub>
</p>

<p>
  <a href="#快速开始"><img src="https://img.shields.io/badge/快速开始-Read%20Guide-2563eb?style=for-the-badge" alt="快速开始" /></a>
  <a href="https://github.com/guolola/questionnaire-star---react/issues"><img src="https://img.shields.io/badge/Feedback-Open%20Issue-0f766e?style=for-the-badge" alt="Report an issue" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-7c3aed?style=for-the-badge" alt="MIT License" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square" alt="React: 18" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178c6?style=flat-square" alt="Language: TypeScript" />
  <img src="https://img.shields.io/badge/UI-Ant%20Design%205-1677ff?style=flat-square" alt="UI: Ant Design 5" />
  <img src="https://img.shields.io/badge/Build-Vite%207-646cff?style=flat-square" alt="Build: Vite 7" />
</p>

> 组合题目，梳理流程，理解反馈。将题型组件、画布设置和统计视图放进同一个可视化工作台。

</div>

## 项目介绍

基于 React、TypeScript 和 Ant Design 的问卷编辑前端。通过组件库搭建问卷，在画布中调整顺序与属性，并管理问卷、查看答卷统计。

本仓库包含**编辑器前端**，登录、数据保存与统计需要独立 API 服务，仓库未包含后端。[配套答题端原型](https://github.com/guolola/qustion-star-c) 独立维护，目前尚未完成端到端联通。

[使用流程](#选择使用流程) · [核心能力](#核心能力) · [本地运行](#快速开始) · [架构与目录](#架构与目录)

## 选择使用流程

| 从这里开始 | 使用方式 | 依赖条件 |
| --- | --- | --- |
| 手动搭建问卷 | 添加组件、排列画布、调整属性与页面设置 | 编辑器状态；加载和保存需要 API |
| AI 辅助起草 | 在 AI 面板描述需求，审核生成的题目配置 | 已配置的 AI 服务；源码默认密钥为空 |
| 查看答卷 | 打开统计页面，查看题目级图表 | 需要后端联调；当前汇总卡片使用示例数据 |

1. 从管理视图创建或打开问卷。
2. 从组件库添加题目，在画布中调整顺序。
3. 修改组件属性、页面设置与适用的校验规则。
4. 通过后端适配层保存，接着实现或接入发布与答卷收集服务。

[答题端仓库](https://github.com/guolola/qustion-star-c) 是独立的早期原型，两个仓库尚未提供从发布到提交的完整联通流程。

## 界面预览

源码附带一张组件库截图，展示现有组件库界面，不代表已独立验证的部署环境或完整编辑器页面。

<details>
<summary>查看组件库截图</summary>

<p align="center"><img src="./1752586709452.png" width="360" alt="源码附带的问卷组件库截图" /></p>

</details>

## 核心能力

| 模块 | 源码包含的内容 |
| --- | --- |
| 题型组件库 | 19 个已注册组件，覆盖文本、选择、日期、数字、评分、矩阵及文件上传等 |
| 可视化编辑 | 拖拽排序、属性与页面设置、图层及撤销/重做状态 |
| 问卷管理 | 列表、搜索、收藏、复制与回收站视图，以及对应 API 适配层 |
| 答卷统计 | 答卷视图与基于 Recharts 的图表组件 |
| AI 辅助 | DeepSeek 问卷生成与流式调用代码，需要配置服务 |
| 高级工具 | 条件逻辑、校验、多页与逻辑分支的编辑界面和工具模块 |

高级控件提供扩展入口，实际运行效果需要结合后端验证。支付、文件上传、签名等组件用于实际业务前，需要接入相应服务。

### 当前范围

| 能力 | 前端源码 | 需要补充或验证 |
| --- | :---: | --- |
| 题型组件与属性编辑 | 已包含 | 根据实际题目结构逐项验证 |
| 拖拽排序、复制粘贴、隐藏和锁定 | 已包含 | 使用真实问卷数据走通编辑流程 |
| 登录与问卷保存 | API 适配层 | 提供并配置兼容后端 |
| 答卷统计 | 页面与图表组件 | 替换示例汇总数字，接入真实答卷 |
| 文件上传、支付与签名 | 界面组件 | 对接存储或相应业务服务 |
| 已发布问卷收集 | 独立原型 | 定义并联通发布和提交接口 |

## 快速开始

### 1. 安装与启动

准备 Node.js 22.12+ 和 npm：

```bash
git clone https://github.com/guolola/questionnaire-star---react.git
cd questionnaire-star---react
npm install
npm run dev
```

打开 Vite 输出的本地地址，通常为 `http://localhost:5173`。

### 2. 连接后端

`vite.config.ts` 将开发环境的 `/api` 请求转发到 `http://localhost:3001`。在该地址运行兼容后端，或修改代理目标。`src/services` 定义用户、问卷和统计接口，响应结构约定为 `{ errno: 0, data: ... }`。

`src/_mock` 中的简单示例不构成完整后端，应用入口也未加载它。未连接后端时，登录和管理流程无法完整使用。部署时需要在托管服务配置 `/api` 路由及 SPA 回退，Vite 开发代理不会进入生产构建。

### 3. 配置 AI 辅助

迁移后的源码不携带 API Key。`src/services/deepseekApi.ts` 的默认密钥为空。多人使用或公开部署时，请将服务商凭据保存在服务端，通过经过鉴权的后端转发 AI 请求。不要将真实密钥写入前端代码或 `VITE_*` 变量，它们会暴露在浏览器产物中。

## 架构与目录

| 目录 | 职责 |
| --- | --- |
| `src/components/QuestionComponents` | 题型渲染、属性编辑与统计组件 |
| `src/pages/question/Edit` | 画布、工具栏、侧边面板与 AI 对话 |
| `src/pages/question/Stat` | 问卷答卷分析 |
| `src/pages/manage` | 问卷列表、收藏与回收站 |
| `src/store` | Redux 状态、页面设置与编辑历史 |
| `src/services` | 后端及 AI 客户端适配 |
| `src/utils` | 校验、分支等高级功能工具 |

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务 |
| `npm run build` | 类型检查并构建前端 |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | ESLint 检查 |
| `npm run format:check` | 检查源码格式 |

## 迁移说明

源码来自 [Gitee](https://gitee.com/guolola/questionnaire-star---react)。迁移时已从历史提交中清除硬编码的服务商密钥，因此受影响的提交哈希与原仓库不同，作者和时间信息保留。已经暴露的凭据仍需在服务商后台撤销。

## 文档入口

- [题型组件注册](./src/components/QuestionComponents/index.ts)
- [页面路由](./src/router/index.tsx)
- [开发代理配置](./vite.config.ts)
- [问卷 API 适配](./src/services/question.ts)
- [答题端原型](https://github.com/guolola/qustion-star-c)

## 开源协议

[MIT](./LICENSE) · Copyright © 2026 guolola。
