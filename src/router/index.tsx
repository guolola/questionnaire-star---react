import { createBrowserRouter } from 'react-router-dom';
// 导入布局组件
import MainLayout from '../layouts/MainLayout';
import ManageLayout from '../layouts/ManageLayout';
import QuestionLayout from '../layouts/QuestionLayout';
// 导入页面组件
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
// 导入管理相关页面
import ManageList from '../pages/manage/List';
import ManageStart from '../pages/manage/Star';
import ManageTrash from '../pages/manage/Trash';
// 导入问卷相关页面
import QuestionEdit from '../pages/question/Edit/index';
import QuestionStat from '../pages/question/Stat/index';

/**
 * 路由配置
 * 使用 createBrowserRouter 创建浏览器路由
 * 支持嵌套路由和动态路由
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 首页路由
      {
        index: true, // 首页路由
        element: <Home />,
      },
      // 登录页面路由
      {
        path: '/login',
        element: <Login />,
      },
      // 注册页面路由
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  // 管理模块路由组 - 使用ManageLayout布局
  {
    path: '/manage',
    element: <ManageLayout />,
    children: [
      {
        path: 'list', // 访问路径: /manage/list
        element: <ManageList />,
      },
      {
        path: 'star', // 访问路径: /manage/star
        element: <ManageStart />,
      },
      {
        path: 'trash', // 访问路径: /manage/trash
        element: <ManageTrash />,
      },
    ],
  },
  // 问卷模块路由组 - 使用QuestionLayout布局
  {
    path: '/question',
    element: <QuestionLayout />,
    children: [
      {
        path: 'edit/:id', // 访问路径: /question/edit
        element: <QuestionEdit />,
      },
      {
        path: 'stat/:id', // 访问路径: /question/stat
        element: <QuestionStat />,
      },
    ],
  },
  // 404页面路由 - 匹配所有未定义的路径
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

export const HOME_PATHNAME = '/';
export const LOGIN_PATHNAME = '/login';
export const REGISTER_PATHNAME = '/register';
export const MANAGE_INDEX_PATHNAME = '/manage/list';
