import { RouterProvider } from 'react-router-dom';
import routerConfig from './router';
import 'antd/dist/reset.css';
import './App.css';
import './styles/theme.scss';

function App() {
  return <RouterProvider router={routerConfig} />;
}
export default App;
