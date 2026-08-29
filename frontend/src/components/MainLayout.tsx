import React, { useState } from 'react';
import { Layout, Menu, theme, Typography, Avatar, Space } from 'antd';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  SettingOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { ProductTable } from '../page/ProductTable';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // ดึงค่า Theme Color จาก Ant Design Config
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar เมนูด้านข้าง */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        width={240} // กำหนดความกว้างพิกเซล
      >
        {/* ส่วน โลโก้ ระบบ */}
        <div 
          style={{ 
            height: 48, 
            margin: 16, 
            background: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: collapsed ? '12px' : '16px',
            transition: 'all 0.2s'
          }}
        >
          {collapsed ? 'PMS' : 'Inventory System'}
        </div>

        {/* รายการเมนูหลัก */}
        <Menu
          theme="dark"
          defaultSelectedKeys={['products']}
          mode="inline"
          items={[
            {
              key: 'products',
              icon: <ShoppingOutlined />,
              label: 'Product Management',
            },
            {
              key: 'master-data',
              icon: <AppstoreOutlined />,
              label: 'Master Data',
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Settings',
            },
          ]}
        />
      </Sider>

      {/* พื้นที่ฝั่งขวา (Header + Content) */}
      <Layout>
        {/* Header แถบบน */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Product Management
          </Title>

          {/* โปรไฟล์ผู้ใช้งาน */}
          <Space size="middle">
            <Avatar icon={<UserOutlined />} />
            <span>Admin User</span>
          </Space>
        </Header>

        {/* Content ส่วนแสดงผลตาราง ProductTable */}
        <Content style={{ margin: '16px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ProductTable />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;