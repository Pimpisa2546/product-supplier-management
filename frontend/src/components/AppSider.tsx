import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { AppstoreOutlined, ShoppingOutlined, } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export const AppSider: React.FC =() => {
    const [collapsed,setCollapsed] = useState(false);
    const navigator = useNavigate();

    const menuItems = [
      { key: '/products', icon: <ShoppingOutlined />, 
        label: "Product",

      },
      { key: '/suppliers', icon: <AppstoreOutlined />, 
        label: "Supplier" },
    ];

    const handleMenuClick: MenuProps["onClick"] = (e) => {
      navigator(e.key);
    };

    return(
        <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      width={150} 
      style={{ overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
     }}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />

      <Menu theme="dark" mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
      >

        </Menu>
    </Sider>
    );
};
export default AppSider; 

