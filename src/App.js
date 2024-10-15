import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import ExpertDigestForm from './components/ExpertDigestForm';
import KatyaComponent from './components/KatyaComponent';
import VikaComponent from './components/VikaComponent';

const { Sider, Content } = Layout;

const App = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <ExpertDigestForm />;
      case '2':
        return <KatyaComponent />;
      case '3':
        return <VikaComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]} onClick={(e) => setSelectedMenu(e.key)}>
          <Menu.Item key="1" icon={<FileTextOutlined />}>
            Дайджест
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Катя
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            Вика
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 360 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
