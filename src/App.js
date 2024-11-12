import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import ExpertDigestForm from './components/Digest/ExpertDigestForm';
import KatyaComponent from './components/Katya/KatyaComponent';
import VikaComponent from './components/VikaComponent';
import CalendarEvent from './components/Calendar/CalendarEvent';

const { Sider, Content } = Layout;

const App = () => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu />
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 360 }}>
          <Routes>
            <Route path="/" element={<ExpertDigestForm />} />
            <Route path="/katya" element={<KatyaComponent />} />
            <Route path="/vika" element={<VikaComponent />} />
            <Route path="/calendar" element={<CalendarEvent />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

const SiderMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем, какой ключ меню активен, исходя из текущего пути
  const getMenuKey = () => {
    switch (location.pathname) {
      case '/':
        return '1';
      case '/katya':
        return '2';
      case '/vika':
        return '3';
        case '/calendar':
          return '4';
      default:
        return '1';
    }
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1':
        navigate('/');
        break;
      case '2':
        navigate('/katya');
        break;
      case '3':
        navigate('/vika');
        break;
        case '3':
        navigate('/calendar');
        break;
      default:
        break;
    }
  };

  return (
    <Sider collapsible>
      <Menu theme="dark" mode="inline" selectedKeys={[getMenuKey()]} onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<FileTextOutlined />}>
          <Link to="/">Дайджест</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/katya">Катя</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />}>
          <Link to="/vika">Вика</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/calendar">Календарь</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default App;
